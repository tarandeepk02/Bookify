const util = require("../models/util.js")
const config = require("../server/config/config")
const User = require("../models/user")
const client = util.getMongoClient(false)
const express = require("express")
const bcrypt = require('bcrypt')
const homeController = express.Router()
const { body, validationResult } = require('express-validator')

homeController.get("/", util.logRequest, (req, res) => {
  res.sendFile("index.html")
})
homeController.get("/index.html", util.logRequest, (req, res) => {
  res.sendFile("index.html")
})
homeController.get("/index.html", util.logRequest, (req, res) => {
  res.sendFile("index.html")
})
homeController.get("/about", util.logRequest, (req, res) => {
  res.sendFile("about.html")
})

// Sign Up HTTP POST
const signupValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email ID is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('confirm').notEmpty().withMessage('Confirm Password is required')
]

homeController.post("/register", util.logRequest, signupValidationRules, async (req, res, next) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.mapped() })
  }

  let collection = client.db().collection("Users")
  let { name, email, password, confirm } = req.body

  if (password !== confirm) {
    res
      .status(400)
      .json({ status: 400, msg: "Passwords do not match. Please try again." })
  }

  // Create a user object and insert it into the database
  let user = User(name, email, password)
  //console.info(user)

  try {
    const existingUser = await collection.findOne({ email: email })

    if (existingUser) {
      //console.log("\t| Email already exists")
      res
        .status(400)
        .json({
          status: 400,
          msg: "Email already in use. Please try another one.",
        })
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
      await util.insertOne(collection, user)
      res
        .status(200)
        .json({ status: 200, msg: "User registered successfully" })
    }
  } catch (error) {
    //console.error("Error inserting user:", error)
    res.status(500).json({
      status: 500,
      msg: "An error occurred while registering the user. Please try again later.",
    })
  }
})

// Login HTTP POST
homeController.post("/login", util.logRequest, async (req, res, next) => {
  let collection = client.db().collection("Users")
  let { email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const existingUser = await collection.findOne({
      email: email,
    })

    if (existingUser && await bcrypt.compare(password, existingUser.password)) {
      req.session.user = {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        picture: existingUser.picture,
      }
      res
        .status(200)
        .json({ status: 200, msg: "User logged in successfully", userRole: existingUser.role })
    } else {
      res
        .status(400)
        .json({
          status: 400,
          msg: "Wrong Email & Password. Please try another one.",
        })
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      msg: "An error occurred while logging in the user. Please try again later.",
    })
  }
})

module.exports = homeController
