// backend/swagger.js   ← rename the file to this if you want
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');

function setupSwagger(app, options = {}) {
  const uiPath = options.uiPath || '/docs';
  const jsonPath = options.jsonPath || '/api-docs';

  // Serve the raw OpenAPI JSON
  app.get(jsonPath, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(openapiSpec);
  });

  // Serve Swagger UI – THIS IS THE CORRECT WAY
  app.use(
    uiPath,
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      explorer: true,
      swaggerOptions: {
        url: `${jsonPath}`, // critical: tells UI where to fetch the spec
      },
    })
  );

  // Do not assume a port here — server will log full URLs after listening
}

module.exports = setupSwagger;