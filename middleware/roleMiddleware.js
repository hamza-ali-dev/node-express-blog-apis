const logger = require('../utils/logger');

exports.authorizeRole = (role) => (req, res, next) => {
  logger.info(`User with role ${req.user.role} attempted to access route requiring ${role} role.`);

  if (req.user.role !== role) {
    logger.warn(`Unauthorized access attempt by user with role ${req.user.role}`);
    return res.status(403).json({ error: 'Unauthorized' });
  }

  logger.info(`User with role ${req.user.role} authorized for the requested action.`);
  next();
};
