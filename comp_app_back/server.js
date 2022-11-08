const dotenv = require('dotenv');
// const path = require('path');

const app = require('./app');

dotenv.config({ path: './.env' });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
