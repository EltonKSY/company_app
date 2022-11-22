const redis = require('redis');

const client = redis.createClient();

exports.cache = async (req, res, next) => {
  await client.connect();
  const result = await client.get('employees');

  if (result) {
    await client.disconnect();
    return res.status(200).json({ status: 'success', result: JSON.parse(result) });
  }

  next();
};
