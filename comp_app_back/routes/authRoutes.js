const express = require('express');
const employeeController = require('./../controllers/employeeController');

const router = express.Router();

//POST is the only req on /Authenticate endpoint
router.route('/').post(employeeController.authEmployee);

module.exports = router;
