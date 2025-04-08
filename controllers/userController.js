const util = require('../models/util.js')
const config = require("../server/config/config")
const client = util.getMongoClient(false)
const express = require('express')
const userController = express.Router()
const { ObjectId } = require('mongodb')

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

// HTTP GET to fetch all users
userController.get('/users', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Users')
    let Users = await util.findAll(collection, {})
    res.status(200).json(Users)
})

// HTTP GET to fetch a single user by their ID
userController.get('/user/:ID', async (request, response, next) => {
    let id = request.params.ID
    console.info(`User Id ${id}`)
    let collection = client.db().collection('Users')
    let user = await util.findOne(collection, id)

    //console.log('user', user)
    response.status(200).json({ user: user })
})

// HTTP DELETE to delete a user by their ID
userController.delete('/user/:id', util.logRequest, async (req, res, next) => {
    const userId = req.params.id;
    //console.info(`Deleting user with ID: ${userId}`)    
    try {
        let collection = client.db().collection('Users')
        const result = await collection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            res.status(404).json({ 'msg': 'User not found' });
        }
        //console.info(`User with ID: ${userId} deleted successfully`)
        res.status(200).send({ 'msg': 'User deleted successfully' });
    } catch (err) {
        //console.error('Error deleting user:', err);
        res.status(500).json({ 'msg': 'Error deleting user' });
    }
})

module.exports = userController