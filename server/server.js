/*
 Loading built-in modules
*/
const fs = require("fs")
const path = require("path")
/*
  Loading external modules
*/
const express = require("express")
const session = require('express-session'); 
const MongoDBStore = require('connect-mongo');
const server = express()
const MongoClient = require("mongodb").MongoClient

/*
  Loading internal modules
*/
const config = require("./config/config")
const util = require('../models/util.js')
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const dashboardController = require('../controllers/dashboardController')
const checkoutController = require('../controllers/checkoutController')
//----------------------------------------------------------------


//----------------------------------------------------------------
// const port = 8080;  // Set port to 8080
// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
// Serve static files (images, CSS, JS) from the 'uploads' folder
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Example route
server.get('/photo', (req, res) => {
  console.log('Requested:', req.originalUrl); // Log the requested URL
  console.log('Image Path:', path.join(__dirname, 'uploads', '1743750645724.PNG'));
  res.send('<h1>Image Example</h1><img src="/uploads/1743750645724.PNG" alt="Image" />');
});
// setting view
//server.set('view engine', 'ejs')


// Session Middleware (Added)

// Initialize the MongoDB session store
const uri = 'mongodb+srv://taranbenipal02:fNROueEjFXcuET4o@spring2025.wthdnbs.mongodb.net/Bookify?retryWrites=true&w=majority';

const mongoSessionStore = MongoDBStore.create({
  mongoUrl: uri, // Replace with your MongoDB connection string
  collectionName: 'Sessions', // Optional: Specify your session collection name
  ttl: 60 * 60 * 24 * 7, // Optional: 7 days TTL for session
  crypto: {
    secret: 'your_secret_key', // Optionally add encryption for session data
  },
});

server.use(
  session({
    secret: 'your_secret_key',  // Secret to sign the session ID cookie
    resave: false,              // Don't save session if unmodified
    rolling: true,
    saveUninitialized: false,   // Don't create session until something is stored
    store: mongoSessionStore,
    cookie: {
      httpOnly: true,           // Prevent client-side JavaScript access to cookie
      maxAge: null,             // Session cookie stays alive until user logs out
    },
  })
);

server.get("/session-info", (req, res) => {
  if (req.session.user) {
    // Session exists, send user data
    return res.status(200).json({status:200, user: req.session.user });
  } else {
    // No session, send null
    return res.status(500).json({status:500, user: null });
  }
});

// Route for logging out
server.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: 500, message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    //return res.status(200).json({ status: 200, message: 'Logged out successfully' });
    res.redirect('/index.html')
  });
});

//----------------------------------------------------------------
// middleware
server.use(express.static(config.ROOT))
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(homeController)
server.use(userController)
server.use(bookController)
server.use(dashboardController)
server.use(checkoutController)
server.get('/logs', async (req, res, next) => {
  util.logRequest(req, res, next)
})
// catch all middleware
server.use((req, res, next) => {
  //res.status(404).sendFile('404.html',{root:config.ROOT})
  res.status(404).sendFile('404.html', { root: config.ROOT })
})
server.listen(config.PORT, "localhost", () => {
  console.log(`\t|Server listening on ${config.PORT}`)
})