const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/file');
const { send } = require('process');

// Configure multer storage
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Multer upload configuration
let upload = multer({
    storage: storage,
    limit: { fileSize: 1000000 * 100 },  // 100MB file size limit
}).single('myfile');

// POST route for file upload
router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        // Validate if file is present in the request
        if (!req.file) {
            return res.json({ error: "File is required" });
        }
        // Validate if sender and receiver are present in the body
        if (!req.body.sender || !req.body.receiver) {
            return res.json({ error: "Sender and receiver are required" });
        }
        // Handle any multer errors
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        
        // Store file details in the database
        try {
            const file = new File({
                filename: req.file.filename,
                uuid: uuidv4(),
                path: req.file.path,
                size: req.file.size,
                sender: req.body.sender,
                receiver: req.body.receiver
            });
            
            // Save file record to the database
            const response = await file.save();
            
            // Send response with file URL
            return res.json({
                file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
            });
        } catch (error) {
            return res.status(500).json({ error: 'Database save error' });
        }
    });
});

module.exports = router;
