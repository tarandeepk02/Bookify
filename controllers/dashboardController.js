const util = require('../models/util.js')
const config = require("../server/config/config")
const client = util.getMongoClient(false)
const express = require('express')
const dashboardController = express.Router()
const { ObjectId } = require('mongodb')
const { body, validationResult } = require('express-validator')
const upload = require('../models/imageUpload')
const bcrypt = require('bcrypt')

// --------------------
// GET User Profile
// --------------------
dashboardController.get('/profile', util.authenticateUser, async (request, response, next) => {
    try {
        let id = request.session.user.id
        if (!id) {
            return response.status(401).json({ error: 'Unauthorized: User not logged in.' })
        }
        //console.info(`User Id ${id}`)
        let collection = client.db().collection('Users')
        let user = await util.findOne(collection, id)
        //console.log('user', user)
        response.status(200).json({ user: user })
    } catch (error) {
        console.error('Error fetching profile:', error)
        next(error)
    }
})

// --------------------
// Profile Update - Validation Rules
// --------------------
const profileValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
]

// --------------------
// POST Update Profile
// -------------------
dashboardController.post('/profile', util.logRequest, util.authenticateUser, upload.single('picture'), profileValidationRules, async (request, response, next) => {

    try {
        let id = request.session.user.id

        if (!id) {
            response.status(401).json({ error: 'Unauthorized: User not logged in.' })
        }

        const errors = validationResult(request)

        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.mapped() })
        }

        const { name } = request.body
        const picture = request.file ? '/uploads/' + request.file.filename : request.session.user.picture
        const collection = client.db().collection('Users')

        const result = await util.updateOne(collection,
            { _id: new ObjectId(id) },
            { name: name, picture: picture }
        )

        if (result.modifiedCount === 1) {
            request.session.user.name = name
            request.session.user.picture = picture

            response.status(200).json({ status: 200, message: 'Profile updated successfully.' })
        } else {
            response.status(304).json({ status: 304, message: 'No changes made to the profile.' })
        }
    } catch (error) {
        //console.error('Error updating profile:', error)
        next(error)
    }

})

// --------------------
// Password Change - Validation Rules
// --------------------
const passwordValidationRules = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Confirm password must match new password')
        }
        return true
    })
]

// --------------------
// POST Change Password
// --------------------
dashboardController.post('/password', util.logRequest, util.authenticateUser, passwordValidationRules, async (request, response, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = request.body
        let id = request.session.user.id

        if (!id) {
            response.status(401).json({ error: 'Unauthorized: User not logged in.' })
        }

        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            response.status(400).json({ errors: errors.mapped() })
        }

        let collection = client.db().collection('Users')
        let user = await util.findOne(collection, id)

        if (!user) {
            response.status(404).json({ status: 400, error: 'User not found' })
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password)
        if (!isOldPasswordCorrect) {
            response.status(400).json({ status: 400, error: 'Old password is incorrect' })
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        const result = await util.updateOne(collection,
            { _id: new ObjectId(id) },
            { password: hashedNewPassword }
        )

        if (result.modifiedCount === 1) {
            response.status(200).json({ status: 200, message: 'Password updated successfully.' })
        } else {
            response.status(304).json({ status: 304, message: 'No changes made to the password.' })
        }
    } catch (error) {
        //console.error('Error updating password:', error)
        next(error)
    }
})

module.exports = dashboardController