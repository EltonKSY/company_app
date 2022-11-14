const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { promisify } = require('util');

const connection = require('../database/companyDB');
const catchAsync = require('./../helpers/catchAsync');
const appError = require('./../helpers/appErrors');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.UID);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.pw = undefined;
  return res.status(statusCode).json({
    status: 'success',
    token,
    result: user,
  });
};

//Authenticate user and return JWT if valid
exports.authEmployee =
  ('/Authenticate',
  catchAsync(async (req, res, next) => {
    const { user_name, password } = req.body;

    // 1) Check if username and password exist
    if (!user_name || !password) return next(new appError('Please provide user name and password!', 400));

    // 2) Check if user exists && password is correct
    const q = `SELECT f_name,  l_name, email, pw, is_active, DOB, Employees.eid AS EID, Employees.uid AS UID FROM Users
        JOIN Employees ON  Users.uid = Employees.uid
          WHERE user_name = "${user_name}";`;

    connection.query(
      q,
      [],
      catchAsync(async function (err, user) {
        if (!user?.length) return next(new appError('Authentication failed, invalid credentials', 401));
        if (await bcrypt.compare(req?.body?.password, user[0].pw)) createSendToken(user[0], 201, res);
        else return next(new appError('Authentication failed, invalid credentials', 401));
      }),
    );
  }));

//Prevents access to requests without a valid token
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  const JWT = req.headers.authorization?.split(' ')[1];
  if (!JWT) return next(new appError('You are not logged in! Please log in to get access.', 401));

  // 2) Decode the token
  const decoded = await promisify(jwt.verify)(JWT, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const q = `SELECT * FROM Users WHERE uid = "${decoded.id}"`;
  let user;
  connection.query(
    q,
    [],
    catchAsync(async function (err, res) {
      if (!res?.length) return next(new appError('The user belonging to this token does not exist.', 401));
      user = res;
      // 4)  GRANT ACCESS TO PROTECTED ROUTE
    }),
  );
  req.user = user;

  next();
});
