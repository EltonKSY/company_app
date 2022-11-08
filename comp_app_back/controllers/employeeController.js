const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');

const catchAsync = require('./../helpers/catchAsync');
const appError = require('./../helpers/appErrors');

dotenv.config({ path: __dirname + '/../.env' });

//CONNECTION TO THE DB
const { DB_HOST, DB_UID, DB_PW, DB } = process.env;
connection = mysql.createPool({
  host: DB_HOST,
  user: DB_UID,
  password: DB_PW,
  database: DB,
});

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.uid);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    result: {
      uid: user.uid,
      user_name: user.user_name,
    },
  });
};

const protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  const JWT = req.headers.authorization?.split(' ')[1];
  //   console.log(JWT);
  if (!JWT) {
    console.log(false);
    return next(new appError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Decode the token
  const decoded = await promisify(jwt.verify)(JWT, process.env.JWT_SECRET);
  //   console.log(decoded.id);
  // 3) Check if user still exists
  const q = `SELECT * FROM Users WHERE uid = "${decoded.id}"`;
  let us;
  connection.query(
    q,
    [],
    catchAsync(async function (err, user) {
      if (!user?.length) return next(new appError('The user belonging to this token does not exist.', 401));
      us = user;
      // 4)  GRANT ACCESS TO PROTECTED ROUTE
    }),
  );
  req.user = us;

  console.log(1);
  next();
};

//Authenticate user and return JWT if valid
exports.authEmployee =
  ('/Authenticate',
  catchAsync(async (req, res, next) => {
    const { user_name, password } = req.body;

    // 1) Check if username and password exist
    if (!user_name || !password) return next(new appError('Please provide user name and password!', 400));

    // 2) Check if user exists && password is correct
    const q = `SELECT * FROM Users WHERE user_name = "${user_name}"`;

    connection.query(
      q,
      [],
      catchAsync(async function (err, user) {
        if (!user?.length) return next(new appError('Authentication failed, invalid credentials', 401));

        if (await bcrypt.compare(req?.body?.password, user[0].pw)) createSendToken(...user, 201, res);
        else return next(new appError('Authentication failed, invalid credentials', 401));
      }),
    );
  }));

//Get all employees if JWT is valid
exports.getEmployees =
  ('/Employees',
  catchAsync(async (req, res, next) => {
    protect(req, res, next);

    const q = 'SELECT * FROM Employees';

    connection.query(
      q,
      [],
      catchAsync(async function (err, result) {
        res.status(200).json({
          status: 'success',
          result: {
            uid: 'user.uid',
            user_name: 'user.user_name',
          },
        });
      }),
    );

    console.log(2);
  }));

//Get  employee if JWT is valid and id is valid
exports.getEmployee = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

//Add employee if JWT is valid
exports.addEmployee = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

//Update employee if JWT is valid
exports.updateEmployee = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

//Delete employee if JWT is valid
exports.deleteEmployee = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
