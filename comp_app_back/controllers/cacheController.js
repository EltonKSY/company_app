const redis = require('redis');

const client = redis.createClient();

exports.cache = async (req, res, next) => {
  try {
    await client.connect();
    const result = await client.get('employees');
    const resultArr = JSON.parse(result);
    if (resultArr?.length) {
      await client.disconnect();
      return res.status(200).json({ status: 'success', result: resultArr });
    }
    next();
  } catch (error) {
    req.cacheUnaivailable = true;
    next();
  }
};
