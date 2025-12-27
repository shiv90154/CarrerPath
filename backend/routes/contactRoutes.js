const express = require('express');
const {
    sendContactMessage,
    getContactInfo
} = require('../controllers/contactController');

const router = express.Router();

// Contact form submission
router.post('/send-message', sendContactMessage);

// Get contact information
router.get('/info', getContactInfo);

module.exports = router;