const util = require('../models/util.js')
const config = require("../server/config/config")
const Book = require("../models/book")
const client = util.getMongoClient(false)
const express = require('express')
const bookController = express.Router()
const { ObjectId } = require('mongodb')
const { body, validationResult } = require('express-validator')
const upload = require('../models/imageUpload')

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
// Validation rules for the book form data
const bookValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('authors').notEmpty().withMessage('Authors are required'),
    body('publisher').notEmpty().withMessage('Publisher is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isDecimal().withMessage('Price must be a valid number').notEmpty().withMessage('Price is required'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5').optional(),
]

// HTTP POST to add a new book
bookController.post('/addBook', util.logRequest, upload.single('coverImage'), bookValidationRules, async (req, res, next) => {
    // Check for validation errors
    //console.log('Request Body:', req.body)
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.mapped() })
    }

    const { title, authors, isbn, publisher, publishedDate, genre, description, price, rating } = req.body

    const coverImage = req.file ? '/uploads/' + req.file.filename : ''

    try {
        let collection = client.db().collection('Books')
        let book = { title, authors, isbn, publisher, publishedDate, genre, description, coverImage, price, rating }
        await util.insertOne(collection, book)
        res.status(200).json({ status: 200, msg: "Book has been added successfully" })
    } catch (err) {
        next(err)
    }
})

// HTTP POST to edit an existing book
bookController.post('/editBookk', util.logRequest, upload.single('coverImage'), bookValidationRules, async (req, res, next) => {
    //console.log('Request Body:', JSON.stringify(req.body))
    let id = req.body._id

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.mapped() })
        }

        const { _id, title, authors, isbn, publisher, publishedDate, genre, description, price, rating, currentCoverImage } = req.body
        const coverImage = req.file ? '/uploads/' + req.file.filename : currentCoverImage
        //console.log("Cover Image:", coverImage)    
        let collection = client.db().collection('Books')

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
            coverImage
        }

        const result = await util.updateOne(collection,
            { _id: new ObjectId(_id) },
            updatedBook
        )

        if (result.matchedCount === 0) {
            res.status(404).json({ status: 404, msg: "Book not found" })
        }

        res.status(200).json({ status: 200, msg: "Book has been updated successfully" })

    } catch (err) {
        next(err)
    }
})

// HTTP GET to fetch all books
bookController.get('/books', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Books')
    let books = await util.findAll(collection, {})
    res.status(200).json(books)
})

// HTTP GET to fetch a single book by its ID
bookController.get('/book/:ID', async (request, response, next) => {
    let id = request.params.ID
    console.info(`book Id ${id}`)
    let collection = client.db().collection('Books')
    let book = await util.findOne(collection, id)
    console.log('book', book)
    response.status(200).json({ book: book })
})

// HTTP DELETE to delete a book by its ID
bookController.delete('/book/:id', util.logRequest, async (req, res, next) => {
    const bookId = req.params.id
    //console.info(`Deleting Book with ID: ${bookId}`)
    try {
        let collection = client.db().collection('Books')
        const result = await collection.deleteOne({ _id: new ObjectId(bookId) })

        if (result.deletedCount === 0) {
            res.status(404).json({ 'msg': 'Book not found' })
        }

        console.info(`Book with ID: ${bookId} deleted successfully`)
        res.status(200).send({ 'msg': 'Book deleted successfully' })
    } catch (err) {
        console.error('Error deleting book:', err)
        res.status(500).json({ 'msg': 'Error deleting book' })
    }
})

module.exports = bookController