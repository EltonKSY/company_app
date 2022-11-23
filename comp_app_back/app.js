const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const employeesRouter = require('./routes/employeesRoutes');
const authRouter = require('./routes/authRoutes');
const AppError = require('./helpers/AppErrors');
const errorHandler = require('./controllers/errorController');
const { logout } = require('./controllers/authController');

const app = express();
dotenv.config({ path: `${__dirname}/.env` });

// 1) MIDDLEWARES
//a)Use morgan to log when in dev mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//b)Use cors to allow cookies to be set/sent
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2) BODY PARSERS ADDED TO APP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// 3) ROUTES
app.use('/Employees', employeesRouter);
app.use('/Authenticate', authRouter);
app.post('/Logout', logout);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
module.exports = app;
