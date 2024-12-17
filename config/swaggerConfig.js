const swaggerJsDoc = require('swagger-jsdoc');

const userSwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API - Users',
      version: '1.0.0',
      description: 'API Documentation for Users',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/user/*.js'],
};

const adminSwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API - Admins',
      version: '1.0.0',
      description: 'API Documentation for Admins',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/admin/*.js'],
};

const userSwaggerSpecs = swaggerJsDoc(userSwaggerOptions);
const adminSwaggerSpecs = swaggerJsDoc(adminSwaggerOptions);

module.exports = { userSwaggerSpecs, adminSwaggerSpecs };
