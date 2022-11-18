const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
