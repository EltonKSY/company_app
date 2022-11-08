const express = require('express');
const employeeController = require('./../controllers/employeeController');

const router = express.Router();

//GET and POST reqs on /Employees endpoint
router.route('/').get(employeeController.getEmployees).post(employeeController.addEmployee);

//GET PATCH and DELETE reqs on /Employees/{id} endpoint
router.route('/:id').get(employeeController.getEmployee).patch(employeeController.updateEmployee).delete(employeeController.deleteEmployee);

module.exports = router;
