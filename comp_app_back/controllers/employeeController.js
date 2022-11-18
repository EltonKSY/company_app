const { faker } = require('@faker-js/faker');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const { queryPromise, checkCurrUser, getEmpInfo } = require('../helpers/utilityFunctions');

const catchAsync = require('../helpers/catchAsync');

//Get all employees
exports.getEmployees = catchAsync(async (req, res, next) => {
  //Concat Used to turn each employee skill into a json array
  const q = `
  SELECT
    f_name, l_name, email, DOB, is_active, Employees.uid AS UID, 
    EmployeesSkills.eid AS EID,
    CONCAT("[",GROUP_CONCAT(CONCAT("""", skill_name, """" )), "]") AS skills, 
    CONCAT("[",GROUP_CONCAT(CONCAT("""", lvl, """" )), "]") AS levels
    FROM Employees
      JOIN EmployeesSkills ON Employees.eid = EmployeesSkills.eid
          JOIN Skills ON Skills.sid = EmployeesSkills.sid
    GROUP BY Employees.eid;`;

  const result = await queryPromise(q);

  return res.status(200).json({
    status: 'success',
    result,
  });
});

//Get  employee if JWT is valid and id is valid
exports.getEmployee = catchAsync(async (req, res, next) => {
  const uid = req.params?.id === 'currUser' ? await checkCurrUser(req, next) : req.params?.id;

  //Concat is Used to turn employee skill into a json array
  const q = `
  SELECT f_name,  l_name, user_name, email, is_active, DOB, Employees.eid AS EID, Employees.uid AS UID,
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

  const result = await queryPromise(q);

  return res.status(200).json({
    status: 'success',
    result: result[0] || null,
  });
});

exports.addEmployee = catchAsync(async (req, res) => {
  // 1) Normalize and hash incoming Emp data
  const GUIDUser = crypto.randomUUID();
  const GUIDEmp = crypto.randomUUID();
  const { PW } = req.body;
  const { fname, lname, email, isActive, formattedDOB, skillsData, employeeSkillsData } = await getEmpInfo(req, GUIDEmp, GUIDEmp);
  const userName = faker.internet.userName(lname);
  const hashedPassword = await bcrypt.hash(PW, 10);

  //2) Terminate request if invalid data is found
  if (GUIDUser && GUIDEmp && fname && lname && email && hashedPassword && typeof isActive === 'boolean' && skillsData?.length) {
    //Queries
    const qInsertUsers = 'INSERT INTO Users (uid, user_name, pw) VALUES ?';
    const qInsertEmps = 'INSERT INTO Employees (eid, uid, f_name, l_name, DOB, email, is_active) VALUES ?';
    const qInsertSkills = 'INSERT INTO Skills (sid, lvl, skill_name) VALUES ?';
    const qInsertEmSkills = 'INSERT INTO EmployeesSkills (id, eid, sid) VALUES ?';

    //3) Insert Data and respond with new User
    await queryPromise(qInsertUsers, [[GUIDUser, userName, hashedPassword]]);
    await queryPromise(qInsertEmps, [[GUIDEmp, GUIDUser, fname, lname, formattedDOB, email, isActive]]);
    await queryPromise(qInsertSkills, skillsData);
    await queryPromise(qInsertEmSkills, employeeSkillsData);

    return res.status(200).json({
      status: 'success',
      result: { UID: GUIDUser, userName },
    });
  }
  return res.status(404).json({
    status: 'fail',
    message: 'Invalid request, incorrect fields',
  });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  const { EID, fname, lname, email, isActive, formattedDOB, skillsData, employeeSkillsData } = await getEmpInfo(req);

  //Queries
  const qOldSids = `SELECT sid from EmployeesSkills WHERE eid = "${EID}";`;
  const qUpdateEmployee = `UPDATE Employees 
                              SET f_name = '${fname}', l_name = '${lname}', 
                              email = '${email}', DOB = '${formattedDOB}', 
                              is_active = ${isActive} WHERE eid = '${EID}'`;
  const qDelSkills = `DELETE FROM EmployeesSkills WHERE eid='${EID}';`;
  const qInserSkills = 'INSERT INTO Skills (sid, lvl, skill_name) VALUES ?';
  const qInsertEmpsSkills = 'INSERT INTO EmployeesSkills (id, eid, sid) VALUES ?';

  //1) Gather all old skill IDs to be deleted
  const prevSids = await queryPromise(qOldSids);

  // 2) Delete old skills from Skills & EmployeeSkills Junction Table
  await queryPromise(qDelSkills);
  prevSids.forEach(sidOBj => queryPromise(`DELETE FROM Skills WHERE sid='${sidOBj.sid}';`));

  //3) Update New Employee Info
  await queryPromise(qUpdateEmployee);
  await queryPromise(qInserSkills, skillsData);
  await queryPromise(qInsertEmpsSkills, employeeSkillsData);

  // 4) send a request to get employees to return new udated data
  next();
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  const UID = req.params?.id;

  // 1) GET Corresponding Employee ID (EID)
  const EIDArr = await queryPromise(`SELECT eid FROM Employees WHERE Employees.uid = "${UID}";`);
  const EID = EIDArr[0].eid;

  //Queries
  const qSIDs = `SELECT sid FROM Skills WHERE sid IN (SELECT sid FROM EmployeesSkills WHERE eid ="${EID}");`;
  const qUser = `DELETE FROM Users WHERE uid='${UID}';`;
  const qEmp = `DELETE FROM Employees WHERE eid='${EID}';`;
  const qEmpSkills = `DELETE FROM EmployeesSkills WHERE eid='${EID}';`;

  //2) Gather all Skills Ids with EID before deleting from EmployeeSkills Table
  const SIDs = await queryPromise(qSIDs);
  SIDs.forEach(sidOBj => {
    queryPromise(`DELETE FROM Skills WHERE sid='${sidOBj.sid}';`);
  });

  //3) Delete from Users, Employees and EmployeeSkills table
  queryPromise(qUser);
  queryPromise(qEmp);
  queryPromise(qEmpSkills);

  return res.status(200).json({
    status: 'success',
  });
});
