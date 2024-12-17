const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { userSwaggerSpecs, adminSwaggerSpecs } = require('./config/swaggerConfig');
const adminAuthRoutes = require('./routes/admin/auth');
const userAuthRoutes = require('./routes/user/auth');
const postRoutes = require('./routes/user/posts');
const rateLimiter = require('./utils/rateLimiter');
const logger = require('./utils/logger');

const app = express();
app.use(express.json());

app.use(rateLimiter);

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/docs/admin', swaggerUi.serveFiles(adminSwaggerSpecs), swaggerUi.setup(adminSwaggerSpecs));
app.use('/api/docs/user', swaggerUi.serveFiles(userSwaggerSpecs), swaggerUi.setup(userSwaggerSpecs));

app.use('/api/admin/auth', adminAuthRoutes);

app.use('/api/user/auth', userAuthRoutes);
app.use('/api/user/posts', postRoutes);

module.exports = app;
