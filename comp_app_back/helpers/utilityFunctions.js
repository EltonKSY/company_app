const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const connection = require('../database/companyDB');
const AppError = require('./AppErrors');

module.exports = {
  /**
   * Transforms JS date to SQL Format
   * @param {Date} jsDate
   * @returns String
   */
  dateFormatter: jsDate => jsDate.toISOString().slice(0, 10).replace('T', ' '),

  /**
   *
   * @param {String} cookies
   * @param {String} cookieName
   * @returns String
   */
  getCookie: (cookies, cookieName) => {
    const value = `; ${cookies}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  },

  /**
   *
   * @param {String} q
   * @param {Array} values
   * @returns Promise
   */
  queryPromise: (q, values) =>
    new Promise((resolve, reject) => {
      connection.query(q, [values], (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    }),
  /**
   * Checks if user is logged and returns UID if true
   * @param {*} req
   * @param {*} next
   * @returns String
   */
  checkCurrUser: async function checkCurrUser(req, next) {
    // 1) Getting token and check if it's there
    const JWT = module.exports.getCookie(req.headers.cookie, 'comp_app_JWT');

    if (!JWT) next(new AppError('You are not logged in! Please log in to get access.', 401));

    // 2) Decode the token and return the ID used to encode it
    const decoded = await promisify(jwt.verify)(JWT, process.env.JWT_SECRET);
    return decoded.id;
  },

  /**
   * Return object containing employee info to be added or updated
   * @param {*} req
   * @param {String} GUID
   * @param {String} GEID
   * @returns Object
   */
  getEmpInfo: async function (req, GUID, GEID) {
    const UID = req.params?.id || GUID;
    const data = { ...req.body };

    data.formattedDOB = module.exports.dateFormatter(new Date(data.DOB));

    let EID;
    //If GEID, it is a new user
    if (GEID) EID = GEID;
    else {
      //FInd the corresponding EID in the DB
      const EIDArr = await module.exports.queryPromise(`SELECT eid FROM Employees WHERE Employees.uid = "${UID}";`);
      EID = EIDArr[0].eid;
      data.EID = EID;
    }

    //Data to be added/updated in the Skills/EmployeesSkills Table
    const skillsData = [];
    const employeeSkillsData = [];
    data.skills.forEach(skill => {
      const GUIDSkill = crypto.randomUUID();
      skillsData.push([GUIDSkill, skill.level, skill.name]);
      employeeSkillsData.push([null, EID, GUIDSkill]);
    });
    return { ...data, skillsData, employeeSkillsData };
  },
};
