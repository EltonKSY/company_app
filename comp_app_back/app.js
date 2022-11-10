const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const employeesRouter = require('./routes/employeesRoutes');
const authRouter = require('./routes/authRoutes.js');
const appError = require('./helpers/appErrors');
const errorHandler = require('./controllers/errorController');

const app = express();
dotenv.config({ path: __dirname + '/.env' });

// 1) MIDDLEWARES
//Use morgan to log when in dev mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors());

// 2) BODY PARSERS ADDED TO APP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// 3) ROUTES
app.use('/Employees', employeesRouter);
app.use('/Authenticate', authRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
module.exports = app;
