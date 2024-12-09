const port = process.env.PORT ?? 3000;

const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Lonche API documentation',
      description: 'All the endpoints of the API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:' + port }],
  },
  apis: ['./src/**/*.ts'],
};

export default swaggerConfig;
