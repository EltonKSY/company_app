const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: 'autoconfig.gourmandmiami.com',
  user: 'clubst5_comp_admin',
  password: 'Plane.4580skip',
  database: 'clubst5_company',
});

app.post('/Authenticate', async (req, res) => {
  const q = `SELECT * FROM Users WHERE user_name = "${req.body.user_name}"`;

  connection.query(q, [], async function (err, user) {
    if (!user?.length) return res.status(400).send('Authentication failed, invalid credentials');

    try {
      if (await bcrypt.compare(req?.body?.password, user[0].pw)) res.status(200).send('Authentication succeeded');
      else {
        res.status(403).send('Authentication failed, invalid credentials');
      }
    } catch {
      res.status(500).send();
    }
  });
});

app.get('/Employees', async (req, res) => {
  const q = 'SELECT * FROM Employees';

  connection.query(q, [], function (err, result) {
    console.log(result);
    return res.status(200).json({
      status: 'success',
      result,
    });
  });
});

app.listen(3002, 'localhost', () => console.log('Running on port 300!'));
