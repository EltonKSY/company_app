const express = require('express');
const employeeController = require('./../controllers/employeeController');
const authController = require('./../controllers/authController');

const router = express.Router();

//GET and POST reqs on /Employees endpoint
router.route('/').get(authController.protect, employeeController.getEmployees).post(authController.protect, employeeController.addEmployee);

//GET PATCH and DELETE reqs on /Employees/{id} endpoint
//protect prevents acces to non-logged in users
router
  .route('/:id')
  .get(authController.protect, employeeController.getEmployee)
  .patch(authController.protect, employeeController.updateEmployee)
  .delete(authController.protect, employeeController.deleteEmployee);

module.exports = router;
