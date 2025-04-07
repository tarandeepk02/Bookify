const util = require('../models/util.js')
const config = require("../server/config/config")
const Book = require("../models/book")
const client = util.getMongoClient(false)
const express = require('express')
const bookController = express.Router()
const { ObjectId } = require('mongodb')
const { body, validationResult } = require('express-validator');

const multer = require('multer');
const path = require('path');


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
const bookValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('authors').notEmpty().withMessage('Authors are required'),
    body('publisher').notEmpty().withMessage('Publisher is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isDecimal().withMessage('Price must be a valid number').notEmpty().withMessage('Price is required'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5').optional(),
    // The file upload is handled by multer, so no need to validate it here
];
// HTTP POST to add book
bookController.post('/addBook', util.logRequest, upload.single('coverImage'), bookValidationRules, async (req, res, next) => {
    // Check for validation errors
    
    console.log('Request Body:', req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If errors are found, return them as a response
        return res.status(400).json({ errors: errors.mapped() });
    }

    // If no validation errors, proceed with processing the data
    const { title, authors, isbn, publisher, publishedDate, genre, description, price, rating } = req.body;

    // Handle file upload
    const coverImage = req.file ? '/uploads/' + req.file.filename : '';

    console.log("coverImage="+coverImage);

    try {

    let collection = client.db().collection('Books');
    let book = { title, authors, isbn, publisher, publishedDate, genre, description, coverImage, price, rating };

    await util.insertOne(collection, book);
        res.status(200).json({status:200, msg: "Book has been added successfully"}) 

    // 
        // Asynchronously insert the book into MongoDB
         // Redirect to the books page on success
    } catch (err) {
        next(err);  // Pass the error to the error-handling middleware



    }
});


bookController.post('/editBookk', util.logRequest, upload.single('coverImage'), bookValidationRules, async (req, res, next) => {
    // Check for validation errors
    console.log('Request Body:', JSON.stringify(req.body));

    let id = req.body._id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If errors are found, return them as a response
        return res.status(400).json({ errors: errors.mapped() });
    }

    // Destructure fields from the request body
    const { _id, title, authors, isbn, publisher, publishedDate, genre, description, price, rating, currentCoverImage } = req.body;

    // If no new file is uploaded, keep the current cover image (from the existing book)
    const coverImage = req.file ? '/uploads/' + req.file.filename : currentCoverImage;

    console.log("Cover Image:", coverImage);





 // Connect to MongoDB and get the collection
 let collection = client.db().collection('Books');

 // Create the updated book object
 let updatedBook = { 
     title, 
     authors, 
     isbn, 
     publisher, 
     publishedDate, 
     genre, 
     description, 
     price, 
     rating,
     coverImage // This will be the new or existing image path
 };

 // Update the book in the database by its _id (ensure it's a valid ObjectID)
 const result = await collection.updateOne(
     { _id: new ObjectId(id) },
     { $set: updatedBook }  // Update the book fields
 );
 bookController.post('/api/place-order',async (request,response,next)=>{
     const orderItems= request.body;
     try {
         if (!orderItems || orderItems.length === 0) {
             return response.status(400).json({ error: 'No items in order.' });
         }
 
         let collection = client.db().collection('orderLogs');
         try {
             // Insert many order items into the database
             const result = await collection.insertMany(orderItems);
 
             if (result && result.insertedCount > 0) {
                 response.json({ message: 'Order placed successfully.', insertedIds: result.insertedIds });
             } else {
                 response.status(500).json({ error: 'Failed to place order.' });
             }
         } catch (insertError) {
             console.error('Error inserting order items:', insertError);
             response.status(500).json({ error: 'Failed to place order due to database error.' });
         }
 
     } catch (generalError) {
         console.error('General error in place-order:', generalError);
         response.status(500).json({ error: 'An unexpected error occurred.' });
     }
 });

 // Check if the book was found and updated
 if (result.matchedCount === 0) {
     return res.status(404).json({ status: 404, msg: "Book not found" });
 }

 // If the update was successful
 return res.status(200).json({ status: 200, msg: "Book has been updated successfully" });










    try {
       
        
    } catch (err) {
        next(err);  // Pass the error to the error-handling middleware
    }
});


// HTTP GET
bookController.get('/books', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Books')
    let books = await util.findAll(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(books)

})


bookController.get('/book/:ID', async (request, response, next) => {
    // extract the querystring from url
    let id = request.params.ID
    console.info(`book Id ${id}`)
    let collection = client.db().collection('Books')
    let book = await util.findOne(collection, id)
    //const data = Utils.readJson(__dirname + '/../data/posts.json')
    //util.insertMany(posts, data[id])
    console.log('book', book)
    response.status(200).json({ book: book })
})

// HTTP DELETE for deleting a user
bookController.delete('/book/:id', util.logRequest, async (req, res, next) => {
    const bookId = req.params.id;
    console.info(`Deleting Book with ID: ${bookId}`)

    
    try {
        let collection = client.db().collection('Books')
        const result = await collection.deleteOne({ _id: new ObjectId(bookId) });

    if (result.deletedCount === 0) {
        res.status(404).json({'msg':'Book not found'});
    }

    console.info(`Book with ID: ${bookId} deleted successfully`)
    return res.status(200).send({'msg':'Book deleted successfully'});
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({'msg':'Error deleting book'});
    }
})



























// HTTP GET
bookController.get('/users', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Users')
    let Users = await util.findAll(collection, {})
    res.status(200).json(Users)

})











bookController.get('/member', authenticateUser, util.logRequest, async (req, res, next) => {
    console.info('Inside member.html')
    let collection = client.db().collection('Posts')
    let post = Post('Security', 'AAA is a key concept in security', 'Pentester')
    util.insertOne(collection, post)
    res.sendFile('member.html', { root: config.ROOT })
})

bookController.get('/post/:ID', async (request, response, next) => {
    // extract the querystring from url
    let id = request.params.ID
    console.info(`Post Id ${id}`)
    let collection = client.db().collection('Posts')
    let post = await util.findOne(collection, id)
    //const data = Utils.readJson(__dirname + '/../data/posts.json')
    //util.insertMany(posts, data[id])
    console.log('Post', post)
    response.status(200).json({ post: post })
})
bookController.get('/postMessage', util.logRequest, async (req, res, next) => {
    res.sendFile('postMessage.html', { root: config.ROOT })

})


module.exports = bookController