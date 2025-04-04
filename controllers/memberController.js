const util = require('../models/util.js')
const config = require("../server/config/config")
const Post = require("../models/post")
const client = util.getMongoClient(false)
const express = require('express')
const memberController = express.Router()
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

// HTTP GET
memberController.get('/users', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Users')
    let Users = await util.findAll(collection, {})
    res.status(200).json(Users)

})

memberController.get('/user/:ID', async (request, response, next) => {
    // extract the querystring from url
    let id = request.params.ID
    console.info(`User Id ${id}`)
    let collection = client.db().collection('Users')
    let user = await util.findOne(collection, id)
    //const data = Utils.readJson(__dirname + '/../data/posts.json')
    //util.insertMany(posts, data[id])
    console.log('user', user)
    response.status(200).json({ user: user })
})

// HTTP DELETE for deleting a user
memberController.delete('/user/:id', util.logRequest, async (req, res, next) => {
    const userId = req.params.id;
    console.info(`Deleting user with ID: ${userId}`)

    
    try {
        let collection = client.db().collection('Users')
        const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
        res.status(404).json({'msg':'User not found'});
    }

    console.info(`User with ID: ${userId} deleted successfully`)
    return res.status(200).send({'msg':'User deleted successfully'});
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({'msg':'Error deleting user'});
    }
})

















memberController.get('/member', authenticateUser, util.logRequest, async (req, res, next) => {
    console.info('Inside member.html')
    let collection = client.db().collection('Posts')
    let post = Post('Security', 'AAA is a key concept in security', 'Pentester')
    util.insertOne(collection, post)
    res.sendFile('member.html', { root: config.ROOT })
})
// HTTP GET
memberController.get('/posts', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Posts')
    let posts = await util.findAll(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(posts)

})
memberController.get('/post/:ID', async (request, response, next) => {
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
memberController.get('/postMessage', util.logRequest, async (req, res, next) => {
    res.sendFile('postMessage.html', { root: config.ROOT })

})
// HTTP POST
memberController.post('/addPost', util.logRequest, async (req, res, next) => {
    let collection = client.db().collection('Posts')
    let topic = req.body.topic
    let message = req.body.message
    let user = req.body.postedBy
    let post = Post(topic, message, user)
    util.insertOne(collection, post)

    // res.json(
    //     {
    //         message: `You post was added to the ${topic} forum`
    //     }
    // )
    //Utils.saveJson(__dirname + '/../data/posts.json', JSON.stringify(posts))
    res.redirect('/posts.html')
})

module.exports = memberController