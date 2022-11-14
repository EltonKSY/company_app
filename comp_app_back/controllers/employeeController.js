const connection = require('../database/companyDB');
const jwt = require('jsonwebtoken');

const { promisify } = require('util');

const catchAsync = require('./../helpers/catchAsync');
const appError = require('./../helpers/appErrors');

//{{Validation for all the endpoints is done in the routes by the protect module}}

//Get all employees
exports.getEmployees = catchAsync(async (req, res, next) => {
  const q = `
  SELECT
    f_name, l_name, email, DOB, is_active, Employees.uid AS UID, 
    EmployeesSkills.eid AS EID,
    CONCAT("[",GROUP_CONCAT(CONCAT("""", skill_name, """" )), "]") AS skills, 
    CONCAT("[",GROUP_CONCAT(CONCAT("""", lvl, """" )), "]") AS levels
    FROM Employees
      JOIN EmployeesSkills ON Employees.eid = EmployeesSkills.eid
          JOIN Skills ON Skills.sid = EmployeesSkills.sid
    GROUP BY Employees.eid`;

  connection.query(q, [], function (err, result) {
    if (err) return next(new appError(err.code, 404));
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
  const uid = req.params?.id === 'currUser' ? await ownUser(req) : req.params?.id;

  const q = `
  SELECT f_name,  l_name, email, is_active, DOB, Employees.eid AS EID, Employees.uid UID
  FROM Users
    JOIN Employees ON 
        Users.uid =  Employees.uid
      JOIN EmployeesSkills ON 
        EmployeesSkills.eid =  Employees.eid
        JOIN Skills ON 
          Skills.sid =  EmployeesSkills.sid
    WHERE Employees.uid = "${uid}";`;

  connection.query(q, [], function (err, result) {
    if (err) return next(new appError(err.code, 404));
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
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const uid = req.params?.id;
  const eid = req.body?.uid;

  const qUser = `DELETE FROM Users WHERE uid='${uid}';`;
  const qEmp = `DELETE FROM Employees WHERE eid='${eid}';`;
  const qEmpSkills = `DELETE FROM EmployeesSkills WHERE eid='${eid}';`;
  const qSIDs = `SELECT sid FROM Skills WHERE sid IN (SELECT sid FROM EmployeesSkills WHERE eid ="${eid}");`;

  connection.query(qUser, [], (err, result) => err && next(new appError('Failed to delete User', 404)));
  connection.query(qEmp, [], (err, result) => err && next(new appError('Failed to delete Employee', 404)));

  connection.query(qSIDs, [], (err, result) => {
    if (err) return next(new appError('Failed to delete SIDs', 404));
    result.forEach(sidOBj => {
      connection.query(`DELETE FROM Skills WHERE sid='${sidOBj.sid}';`, [], (err, result) => {
        if (err) return next(new appError('Failed to delete Skill', 404));
      });
    });
    connection.query(qEmpSkills, [], (err, result) => {
      if (err) return next(new appError('Failed to delete Employee Skills', 404));
      console.log(result);
    });
  });

  return res.status(200).json({
    status: 'success',
  });
});
