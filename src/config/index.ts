import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
  };
  apis: string[];
}

interface Config {
  port: number;
  environment: string;
  requestBodySizeLimit: string;
  yamlFilePath: string;
  swaggerOptions: SwaggerOptions;
}

const getConfig = (): Config => {
  const {
    PORT = '8000',
    NODE_ENV = 'development',
    REQUEST_BODY_SIZE_LIMIT = '1mb',
    YAML_FILE_PATH = 'src/data/asteroids.yml',
    SWAGGER_TITLE = 'Void Harvester API',
    SWAGGER_VERSION = '1.0.0',
    SWAGGER_DESCRIPTION = 'API for managing asteroid mining resources and orders',
  } = process.env;

  return {
    port: Number(PORT),
    environment: NODE_ENV,
    requestBodySizeLimit: REQUEST_BODY_SIZE_LIMIT,
    yamlFilePath: YAML_FILE_PATH,
    swaggerOptions: {
      definition: {
        openapi: '3.0.0',
        info: {
          title: SWAGGER_TITLE,
          version: SWAGGER_VERSION,
          description: SWAGGER_DESCRIPTION,
        },
      },
      apis: ['./src/routes/*.ts'],
    },
  };
};

const config = getConfig();
const specs = swaggerJsdoc(config.swaggerOptions);

/**
 * Sets up Swagger for API documentation.
 * @param app - The Express application instance.
 */
export const swaggerConfig = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export { config };