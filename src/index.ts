import 'dotenv/config';
import { Command } from 'commander';

import { App } from './app';
import { config } from './config';
import { logger } from './utils';

function bootstrapApp() {
  const program = new Command();
  program
    .version('1.0.0')
    .requiredOption('-f, --file <path>', 'path to the YAML file with asteroid data')
    .parse(process.argv);

  const options = program.opts();

  try {
    const app = new App(config.port);
    app.start(options.file);
  } catch (error) {
    logger.error(`Error starting the application: ${error}`);
    process.exit(1);
  }
}

bootstrapApp();
