const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const connection = require('../database/companyDB');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/AppErrors');
const { getCookie } = require('../helpers/utilityFunctions');

/**
 * Signs a token based on an id field.
 */
const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

/**
 * Creates a signed token and sets it to cookies on the current user browser
 * Password is not sent back as part of the response
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.UID);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('comp_app_JWT', token, cookieOptions);

  user.pw = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    result: user,
  });
};

/**
 * Retrieves user and compared the hash password
 * If valid, a token is sent and set on the browser as a response
 */
exports.authEmployee =
  ('/Authenticate',
  catchAsync(async (req, res, next) => {
    const { user_name, password } = req.body;

    // 1) Check if username and password exist
    if (!user_name || !password) next(new AppError('Please provide user name and password!', 400));

    // 2) Check if user exists && password is correct
    const q = `SELECT f_name,  l_name, email, pw, is_active, DOB, Employees.eid AS EID, Employees.uid AS UID FROM Users
        JOIN Employees ON  Users.uid = Employees.uid
          WHERE user_name = "${user_name}";`;

    connection.query(
      q,
      catchAsync(async (err, user) => {
        if (err) next(new AppError('Something went wrong, authentication failed', 500));
        if (!user?.length) next(new AppError('Authentication failed, invalid credentials', 401));
        if (user[0] && (await bcrypt.compare(req?.body?.password, user[0]?.pw))) createSendToken(user[0], 201, res);
        else next(new AppError('Authentication failed, invalid credentials', 401));
      }),
    );
  }));

/**
 * Prevents access to requests without a valid token
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  const JWT = getCookie(req.headers.cookie, 'comp_app_JWT');

  if (!JWT) return next(new AppError('You are not logged in! Please log in to get access.', 401));
  // 2) Decode the token
  const decoded = await promisify(jwt.verify)(JWT, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const q = `SELECT * FROM Users WHERE uid = "${decoded.id}"`;
  let user;
  connection.query(
    q,
    catchAsync(async (err, userRes) => {
      if (!userRes?.length) next(new AppError('The user belonging to this token does not exist.', 401));
      user = userRes;
      // 4)  GRANT ACCESS TO PROTECTED ROUTE
      req.user = user;

      next();
    }),
  );
});
