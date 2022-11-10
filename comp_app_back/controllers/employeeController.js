const connection = require('../database/companyDB');

const catchAsync = require('./../helpers/catchAsync');
const appError = require('./../helpers/appErrors');

//{{Validation for all the endpoints is done in the routes by the protect module}}

//Get all employees
exports.getEmployees = catchAsync(async (req, res, next) => {
  const q = 'SELECT * FROM Employees';

  connection.query(q, [], function (err, result) {
    if (err) next(new appError(err.code, 404));
    return res.status(200).json({
      status: 'success',
      result,
    });
  });
});

//Get  employee if JWT is valid and id is valid
exports.getEmployee = catchAsync(async (req, res, next) => {
  const eid = req.params?.id;
  const q = `SELECT * FROM Employees WHERE eid = "${eid}";`;

  connection.query(q, [], function (err, result) {
    if (err) return next(new appError(err.code, 404));

    if (!result?.length) return next(new appError('This user does not exist', 404));

    return res.status(200).json({
      status: 'success',
      result: result[0],
    });
  });
});

//Add employee if JWT is valid
exports.addEmployee = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

//Update employee if JWT is valid
exports.updateEmployee = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});

//Delete employee if JWT is valid
exports.deleteEmployee = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
});
