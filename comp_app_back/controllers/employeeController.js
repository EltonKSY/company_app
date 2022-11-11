const connection = require('../database/companyDB');
const jwt = require('jsonwebtoken');

const { promisify } = require('util');

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
async function ownUser(req) {
  // 1) Getting token and check of it's there
  const JWT = req.headers.authorization?.split(' ')[1];
  //   console.log(JWT);
  if (!JWT) return next(new appError('You are not logged in! Please log in to get access.', 401));

  // 2) Decode the token
  const decoded = await promisify(jwt.verify)(JWT, process.env.JWT_SECRET);
  return decoded.id;
}
//Get  employee if JWT is valid and id is valid
exports.getEmployee = catchAsync(async (req, res, next) => {
  const eid = req.params?.id === 'test' ? await ownUser(req) : req.params?.id;

  const q = `SELECT f_name,  l_name, email, is_active, DOB, Employees.eid AS EID, Employees.uid UID
  FROM Users
  JOIN Employees ON 
      Users.uid =  Employees.uid
  JOIN EmployeesSkills ON 
    EmployeesSkills.eid =  Employees.eid
  JOIN Skills ON 
    Skills.sid =  EmployeesSkills.sid
  WHERE Employees.uid = "${eid}";`;

  connection.query(q, [], function (err, result) {
    if (err) return next(new appError(err.code, 404));

    // if (!result?.length) return next(new appError('This user does not exist', 404));
    // result[0].skills = [];
    // result.forEach(res => {
    //   result[0].skills.push(res.skill_name);
    // });
    return res.status(200).json({
      status: 'success',
      result: result[0],
    });
  });
});

//Add employee if JWT is valid
exports.addEmployee = catchAsync(async (req, res) => {
  return res.status(500).json({
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
