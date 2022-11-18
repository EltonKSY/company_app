const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

//POST is the only req on /Authenticate endpoint
router.route('/').post(authController.authEmployee);

module.exports = router;
