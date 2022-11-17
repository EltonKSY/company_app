const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const connection = require('../database/companyDB');

const dateFormatter = require('../helpers/utilityFunctions').toSQLDate;

const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppErrors');

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

  connection.query(q, (err, result) => {
    if (err) next(new AppError(err.code, 404));
    return res.status(200).json({
      status: 'success',
      result,
    });
  });
});
async function ownUser(req, next) {
  // 1) Getting token and check of it's there
  const JWT = req.headers.authorization?.split(' ')[1];

  if (!JWT) next(new AppError('You are not logged in! Please log in to get access.', 401));

  // 2) Decode the token
  const decoded = await promisify(jwt.verify)(JWT, process.env.JWT_SECRET);
  return decoded.id;
}
//Get  employee if JWT is valid and id is valid
exports.getEmployee = catchAsync(async (req, res, next) => {
  const uid = req.params?.id === 'currUser' ? await ownUser(req, next) : req.params?.id;
  const q = `
  SELECT f_name,  l_name, user_name, email, is_active, DOB, Employees.eid AS EID, Employees.uid UID,
    CONCAT("[",GROUP_CONCAT(CONCAT("""", skill_name, """" )), "]") AS skills, 
    CONCAT("[",GROUP_CONCAT(CONCAT("""", lvl, """" )), "]") AS levels
    FROM Users
      JOIN Employees ON 
          Users.uid =  Employees.uid
        JOIN EmployeesSkills ON 
          EmployeesSkills.eid =  Employees.eid
          JOIN Skills ON 
            Skills.sid =  EmployeesSkills.sid
      WHERE Employees.uid = "${uid}";`;

  connection.query(q, (err, result) => {
    if (err) next(new AppError(err.code, 404));
    else
      return res.status(200).json({
        status: 'success',
        result: result[0] || null,
      });
  });
});

const queryPromise = (q, values) =>
  new Promise((resolve, reject) => {
    connection.query(q, [values], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });

//Add employee if JWT is valid
exports.addEmployee = catchAsync(async (req, res, next) => {
  const GUIDUser = crypto.randomUUID();
  const GUIDEmp = crypto.randomUUID();
  const { fname, lname, email, DOB, PW, isActive, skills } = req.body;
  const userName = faker.internet.userName(lname);
  const hashedPassword = await bcrypt.hash(PW, 10);

  const skillsData = [];
  const employeeSkillsData = [];

  skills.forEach(skill => {
    const GUIDSkill = crypto.randomUUID();
    skillsData.push([GUIDSkill, skill.level, skill.name]);
    employeeSkillsData.push([null, GUIDEmp, GUIDSkill]);
  });

  if (GUIDUser && GUIDEmp && fname && lname && email && DOB && PW && hashedPassword && isActive && skills?.length) {
    const q1 = 'INSERT INTO Users (uid, user_name, pw) VALUES ?';
    const q2 = 'INSERT INTO Employees (eid, uid, f_name, l_name, DOB, email, is_active) VALUES ?';
    const q3 = 'INSERT INTO Skills (sid, lvl, skill_name) VALUES ?';
    const q4 = 'INSERT INTO EmployeesSkills (id, eid, sid) VALUES ?';

    connection.query(q1, [[[GUIDUser, userName, hashedPassword]]], (err, result) => {
      if (err) next(new AppError('Could not create user', 404));
    });

    connection.query(q2, [[[GUIDEmp, GUIDUser, fname, lname, dateFormatter(new Date(DOB)), email, isActive]]], (err, result) => {
      if (err) next(new AppError('Could not create Employee', 404));
    });

    connection.query(q3, [skillsData], (err, result) => {
      if (err) next(new AppError('Could not add skills', 404));
    });
    connection.query(q4, [employeeSkillsData], (err, result) => {
      if (err) next(new AppError('Could not create skills and data', 404));
    });

    return res.status(200).json({
      status: 'success',
      result: { UID: GUIDUser, userName },
    });
  }
  return res.status(404).json({
    status: 'fail',
    message: 'Invalid request, please check all fields',
  });
});

//Update employee if JWT is valid
exports.updateEmployee = catchAsync(async (req, res, next) => {
  const { EID, fname, lname, email, DOB, isActive, skills } = req.body;
  const formattedDOB = dateFormatter(new Date(DOB));
  const skillsData = [];
  const employeeSkillsData = [];

  skills.forEach(skill => {
    const GUIDSkill = crypto.randomUUID();
    skillsData.push([GUIDSkill, skill.level, skill.name]);
    employeeSkillsData.push([null, EID, GUIDSkill]);
  });
  const qOldSids = `SELECT sid from EmployeesSkills WHERE eid = "${EID}";`;
  const qUpdateEmployee = `UPDATE Employees SET f_name = '${fname}', l_name = '${lname}', email = '${email}', DOB = '${formattedDOB}', is_active = ${isActive} WHERE eid = '${EID}'`;
  const qDelSkills = `DELETE FROM EmployeesSkills WHERE eid='${EID}';`;
  const q3 = 'INSERT INTO Skills (sid, lvl, skill_name) VALUES ?';
  const q4 = 'INSERT INTO EmployeesSkills (id, eid, sid) VALUES ?';

  try {
    const prevSids = await queryPromise(qOldSids);
    await queryPromise(qUpdateEmployee);
    await queryPromise(qDelSkills);
    await queryPromise(q3, skillsData);
    await queryPromise(q4, employeeSkillsData);

    prevSids.forEach(sidOBj => {
      connection.query(`DELETE FROM Skills WHERE sid='${sidOBj.sid}';`, (err, result) => {
        if (err) next(new AppError('Failed to delete Skill', 404));
      });
    });
  } catch (error) {
    next(new AppError('Failed to add user', 404));
  }

  next();
});

//Delete employee if JWT is valid
exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const uid = req.params?.id;
  const eid = req.body?.eid;

  const qUser = `DELETE FROM Users WHERE uid='${uid}';`;
  const qEmp = `DELETE FROM Employees WHERE eid='${eid}';`;
  const qEmpSkills = `DELETE FROM EmployeesSkills WHERE eid='${eid}';`;
  const qSIDs = `SELECT sid FROM Skills WHERE sid IN (SELECT sid FROM EmployeesSkills WHERE eid ="${eid}");`;

  connection.query(qUser, (err, result) => err && next(new AppError('Failed to delete User', 404)));
  connection.query(qEmp, (err, result) => err && next(new AppError('Failed to delete Employee', 404)));

  connection.query(qSIDs, (errSIDs, resultSID) => {
    if (errSIDs) next(new AppError('Failed to delete SIDs', 404));
    resultSID.forEach(sidOBj => {
      connection.query(`DELETE FROM Skills WHERE sid='${sidOBj.sid}';`, [], (err, result) => {
        if (err) next(new AppError('Failed to delete Skill', 404));
      });
    });
    connection.query(qEmpSkills, [], (err, result) => {
      if (err) next(new AppError('Failed to delete Employee Skills', 404));
    });
  });

  return res.status(200).json({
    status: 'success',
  });
});
