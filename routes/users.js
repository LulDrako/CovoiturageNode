// In routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Signup endpoint
router.post('/signup', userController.signup);

// Login endpoint
router.post('/login', userController.login);

module.exports = router;
