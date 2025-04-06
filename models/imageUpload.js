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

// Initialize multer with the storage and fileFilter options
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Export the upload middleware for use in other controllers
module.exports = upload;
