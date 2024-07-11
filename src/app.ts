import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import { config, swaggerConfig } from './config';
import { RouteBinder } from './routes';
import { logger, loadAsteroids, printAsteroidSummary } from './utils';

export class App {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.initMiddleWare();
    this.initSwagger()
  }

  public getServer(): express.Application {
    return this.app;
  }

  private initMiddleWare(): void {
    this.app.use(express.json({ limit: config.requestBodySizeLimit }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
  }

  private initSwagger() {
    const isProduction = config.environment === 'production';
    if (!isProduction) {
      swaggerConfig(this.app);
    }
  }

  public async start(file: string): Promise<void> {
    try {
      const asteroids = await loadAsteroids(file);
      logger.info('Successfully loaded asteroids');
      new RouteBinder(this.app, asteroids);

      this.app.listen(this.port, () => {
        logger.info(`Server running at http://localhost:${this.port}`);
      });

      printAsteroidSummary(asteroids);
    } catch (error) {
      logger.error('[App] Failed to load asteroids:', error);
      process.exit(1);
    }
  }
}
