const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Access denied: No token provided.');
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      logger.error(`Invalid token: ${err.message}`);
      return res.status(403).json({ error: 'Invalid token' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        logger.warn(`User not found with ID: ${decoded.id}`);
        return res.status(404).json({ error: 'User not found' });
      }

      req.user = user;
      logger.info(`User ${user.email} authenticated successfully.`);
      next();
    } catch (error) {
      logger.error(`Error finding user: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};
