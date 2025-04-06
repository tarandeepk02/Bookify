const util = require('../models/util.js')
const config = require("../server/config/config")
const Post = require("../models/post")
const client = util.getMongoClient(false)
const express = require('express')
const dashboardController = express.Router()
const { ObjectId } = require('mongodb')

const { body, validationResult } = require('express-validator');
const upload = require('../models/imageUpload');
const bcrypt = require('bcrypt');

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


dashboardController.get('/profile', async (request, response, next) => {
    try {
        // extract the querystring from url
        let id = request.session.user.id

        if (!id) {
            return response.status(401).json({ error: 'Unauthorized: User not logged in.' });
        }
        console.info(`User Id ${id}`)
        let collection = client.db().collection('Users')
        let user = await util.findOne(collection, id)
        //console.log('user', user)
        response.status(200).json({ user: user })
    } catch (error) {
        console.error('Error fetching profile:', error);
        next(error);
    }
})

const profileValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
];

dashboardController.post('/profile', util.logRequest, upload.single('picture'), profileValidationRules, async (request, response, next) => {    
    
    
    
    
    
    
    try {
        // extract the querystring from url
    let id = request.session.user.id

    if (!id) {
        return response.status(401).json({ error: 'Unauthorized: User not logged in.' });
    }
    

    const errors = validationResult(request);
    
        if (!errors.isEmpty()) {
            // If errors are found, return them as a response
            return response.status(400).json({ errors: errors.mapped() });
        }
    

    // Extract fields to update from the request body
    const { name } = request.body;
    // Handle file upload
    const picture = request.file ? '/uploads/' + request.file.filename : '';
    
    const collection = client.db().collection('Users');

    // Update name and picture
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: name, picture: picture } }
    );

    if (result.modifiedCount === 1) {
        return response.status(200).json({ status: 200, message: 'Profile updated successfully.' });
    } else {
        return response.status(304).json({ status: 304, message: 'No changes made to the profile.' });
    }
    } catch (error) {
        console.error('Error updating profile:', error);
        next(error);
    }






})



const passwordValidationRules = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Confirm password must match new password');
        }
        return true;
    })
];



dashboardController.post('/password', util.logRequest, passwordValidationRules, async (request, response, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = request.body;
        let id = request.session.user.id;

        if (!id) {
            return response.status(401).json({ error: 'Unauthorized: User not logged in.' });
        }

        

        // Check for validation errors
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.mapped() });
        }

        let collection = client.db().collection('Users');
        let user = await util.findOne(collection, id);

        if (!user) {
            return response.status(404).json({ status:400, error: 'User not found' });
        }

        // Check if old password matches the current password
        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordCorrect) {

            //const hashedNewPassword11 = await bcrypt.hash("123456", 10);


            return response.status(400).json({ status:400, error: 'Old password is incorrect' });
        }

        // Hash the new password before saving
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { password: hashedNewPassword } }
        );

        if (result.modifiedCount === 1) {
            return response.status(200).json({ status: 200, message: 'Password updated successfully.' });
        } else {
            return response.status(304).json({ status: 304, message: 'No changes made to the password.' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        next(error);
    }
});



module.exports = dashboardController