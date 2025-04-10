const util = require('../models/util.js')
const config = require("../server/config/config")

const User = require("../models/user")
const Order = require("../models/order")
const client = util.getMongoClient(false)
const express = require('express')
const checkoutController = express.Router()
const { ObjectId } = require('mongodb')
const { body, validationResult } = require('express-validator')

// HTTP POST
const orderValidationRules = [
    body('checkoutName').notEmpty().withMessage('Name is required'),
    body('checkoutEmail').notEmpty().withMessage('Email is required'),
    body('shippingAddress').notEmpty().withMessage('Shipping Address is required'),
]

// HTTP POST to add book
checkoutController.post('/checkout', util.logRequest, orderValidationRules, async (req, res, next) => {
    //console.log('Request Body:', req.body)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.mapped() })
    }
    const userId = req.session && req.session.user ? req.session.user.id : ''
    const userRole = req.session && req.session.user ? 'member' : 'guest'
    const { checkoutName, checkoutEmail, shippingAddress, subtotal, shipping, total, cart, since } = req.body

    try {
        if (userRole == 'guest') {
            let collectionUser = client.db().collection('Users')
            let user = { name: checkoutName, email: checkoutEmail, role: "guest", since }
            await util.insertOne(collectionUser, user)
        }
        let collection = client.db().collection('Orders')
        let order = { userId, userRole, checkoutName, checkoutEmail, shippingAddress, subtotal, shipping, total, cart, since }

        await util.insertOne(collection, order)

        res.status(200).json({ status: 200, msg: "Order has been added successfully" })

    } catch (err) {
        next(err)
    }
})

checkoutController.get('/orders', util.authenticateUser, async (req, res, next) => {
    try {
        const userId = req.session?.user?.id
        if (!userId) {
            return res.status(401).json({ status: 401, msg: "Unauthorized: not logged in" })
        }
        let collection = client.db().collection('Orders')
        let orders = await util.findAll(collection, { userId: userId })

        return res.status(200).json({ status: 200, orders })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return res.status(500).json({ status: 500, msg: "Server error" })
    }
})

//for admin
checkoutController.get('/orders/all', util.authenticateUser, util.authenticateRole('admin'), async (req, res, next) => {
    try {

        if (!req.session?.user || req.session.user.role !== 'admin') {
            return res.status(403).json({ status: 403, msg: "Forbidden: Admins only" })
        }

        let collection = client.db().collection('Orders')
        let orders = await util.findAll(collection, {})

        return res.status(200).json({ status: 200, orders })
    } catch (error) {
        console.error('Error fetching all orders:', error)
        return res.status(500).json({ status: 500, msg: "Server error" })
    }
})

checkoutController.get('/orders/:id', util.authenticateUser, async (req, res, next) => {
    try {
        const orderId = req.params.id
        if (!ObjectId.isValid(orderId)) {
            return res.status(400).json({ status: 400, msg: "Invalid order ID" })
        }

        let collection = client.db().collection('Orders')
        let order = await util.findOne(collection, new ObjectId(orderId))




        if (!order) {
            return res.status(404).json({ status: 404, msg: "Order not found" })
        }

        res.status(200).json({ status: 200, order })
    } catch (err) {
        console.error("Error getting order:", err)
        res.status(500).json({ status: 500, msg: "Server error" })
    }
})



module.exports = checkoutController