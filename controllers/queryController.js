const util = require('../models/util.js')
const Query = require('../models/query.js')
const config = require("../server/config/config")
const client = util.getMongoClient(false)
const express = require('express')
const queryController = express.Router()
const { ObjectId } = require('mongodb')
const { body, validationResult } = require('express-validator')


// Sign Up HTTP POST
const contactFormValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email ID is required'),
  body('phone').notEmpty().withMessage('Phone number is required.').isNumeric().withMessage('Phone number must be number.').isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits.'),
  body('yourMessage').notEmpty().withMessage('message should be at-least 25 character long')
]

queryController.post("/addQuery", util.logRequest, contactFormValidationRules, async (req, res, next) => {






  try {
    const errors = validationResult(req)


    if (!errors.isEmpty()) {

      res.status(400).json({ errors: errors.mapped() })
    }

    let collection = client.db().collection("Queries")
    let { email, name, phone, yourMessage } = req.body
    let query = Query(name, email, phone, yourMessage)

    util.insertOne(collection, query)
    res.status(200)
      .json({ status: 200, msg: "Our team will contact you shortly " })



  } catch (err) {
    next(err)
  }

})
module.exports = queryController