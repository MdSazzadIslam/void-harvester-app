import * as expressWinston from 'express-winston';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path'

const logFormat = winston.format.printf(({ timestamp, level, message, meta }) => {
  const metaString = meta && Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `[${timestamp}] ${metaString} ${level}: ${message}`;
});

const logDir = path.join(__dirname, '../logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configure transports
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ level: 'info', filename: path.join(logDir, 'app.log') }),
  new winston.transports.File({ level: 'error', filename: path.join(logDir, 'errors.log') }),
];

// Create Winston logger instance
const logger = winston.createLogger({
  transports,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    logFormat
  ),
});

// Enable request body logging for express
expressWinston.requestWhitelist.push('body');

// Create a logging function to be used throughout the application
export function log(message: string, level: string = 'info', meta?: object) {
  logger.log({ level, message, meta });
}

// Export the logger instance for advanced usage if needed
export { logger };
