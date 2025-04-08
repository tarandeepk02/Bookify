const util = require('../models/util.js')
const config = require("../server/config/config")
const Order = require("../models/order")
const User = require("../models/user")
const client = util.getMongoClient(false)
const express = require('express')
const checkoutController = express.Router()
const { ObjectId } = require('mongodb')
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const path = require('path');
const session = require('express-session'); 

// Setup multer storage and file filter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/'); // specify the folder where files should be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // add timestamp to the filename to avoid collisions
    }
});
const fileFilter = (req, file, cb) => {
    // Accept only image files (you can adjust the types as needed)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });


// Authentication & Authorization Middleware
const authenticateUser = (req, res, next) => {
    if (req.user == null) {
        res.status(403)
        return res.send('You need to be logged in')
    } else {
        console.log(req.user)
    }
    next()
}
const authenticateRole = (role, req, res, next) => {
    return (req, res, next) => {
        if (req.user.role == role) {
            res.status(401)
            return res.send('Not authorized')
        }

    }
}


// HTTP POST
const orderValidationRules = [
    body('checkoutName').notEmpty().withMessage('Name is required'),
    body('checkoutEmail').notEmpty().withMessage('Email is required'),
    body('shippingAddress').notEmpty().withMessage('Shipping Address is required'),
    // body('subtotal').notEmpty().withMessage('Publisher is required'),
    // body('shipping').notEmpty().withMessage('Genre is required'),
    // body('total').notEmpty().withMessage('Description is required'),
    // body('cart').isDecimal().withMessage('Price must be a valid number').notEmpty().withMessage('Price is required'),
    
];
// HTTP POST to add book
checkoutController.post('/checkout', util.logRequest, orderValidationRules, async (req, res, next) => {
    // Check for validation errors
    
    console.log('Request Body:', req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If errors are found, return them as a response
        return res.status(400).json({ errors: errors.mapped() });
    }
    const userId =  req.session && req.session.user ? req.session.user.id : '';
    const userRole = req.session && req.session.user ? 'member' : 'guest';
    // If no validation errors, proceed with processing the data
    const {checkoutName, checkoutEmail, shippingAddress, subtotal, shipping, total, cart } = req.body;

    
    try {

        if(userRole=='guest')
        {
            let collectionUser = client.db().collection('Users');
            let user = { checkoutName,checkoutEmail,role:"guest"};

            await util.insertOne(collectionUser, user);
        }




    let collection = client.db().collection('Orders');
    let order = { userId,userRole,checkoutName, checkoutEmail, shippingAddress, subtotal, shipping, total, cart };

    await util.insertOne(collection, order);
        res.status(200).json({status:200, msg: "Order has been added successfully"}) 

    // 
        // Asynchronously insert the book into MongoDB
         // Redirect to the books page on success
    } catch (err) {
        next(err);  // Pass the error to the error-handling middleware



    }
});


module.exports = checkoutController