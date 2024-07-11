import * as fs from 'fs';
import * as yaml from 'yamljs';
import { Asteroid } from '../models';

const requiredKeys = ['name', 'type', 'mass'];

/**
 * Validates the structure of the asteroid data.
 * @param data - The data to validate.
 * @returns True if the data is valid, otherwise false.
 */
const validateAsteroidData = (data: Asteroid): boolean => {
  const keys = Object.keys(data);
  return requiredKeys.every((key) => keys.includes(key));
};

/**
 * Parses and validates asteroid data from a YAML file using yamljs.
 * @param filename - The name of the YAML file to load.
 * @returns A promise that resolves to an array of asteroids.
 */
export const loadAsteroids = (filename: string): Promise<Asteroid[]> => {
  return new Promise((resolve, reject) => {
    const asteroids: Asteroid[] = [];
    const fileStream = fs.createReadStream(filename, 'utf8');
    let yamlData = '';

    fileStream.on('data', (chunk) => {
      yamlData += chunk;
    });

    fileStream.on('end', () => {
      try {
        // Parse YAML data using yamljs
        const parsedData = yaml.parse(yamlData);
        if (!Array.isArray(parsedData)) {
          throw new Error('Invalid YAML format: Expected an array of asteroids.');
        }
        // Validate and process each asteroid
        parsedData.forEach((item: Asteroid) => {
          if (isValidAsteroid(item)) {
            asteroids.push(createAsteroid(item));
          } else {
            reject(new Error(`Invalid asteroid data: ${JSON.stringify(item)}`));
            return;
          }
        });
        resolve(asteroids);
      } catch (error) {
        reject(new Error(`Error parsing or processing YAML file '${filename}': ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });

    fileStream.on('error', (error) => {
      reject(new Error(`Error reading file '${filename}': ${error.message}`));
    });
  });
};

/**
 * Validates if the given data is a valid asteroid.
 * @param data - The data to validate.
 * @returns True if valid, otherwise false.
 */
const isValidAsteroid = (data: Asteroid): boolean => {
  return (
    validateAsteroidData(data) &&
    typeof data.name === 'string' &&
    typeof data.type === 'string' &&
    typeof data.mass === 'number'
  );
};

/**
 * Creates an asteroid object from valid data.
 * @param data - The raw asteroid data.
 * @returns The asteroid object.
 */
const createAsteroid = (data: Asteroid): Asteroid => ({
  name: data.name,
  type: data.type,
  mass: data.mass,
});

/**
 * Prints a summary of the asteroid data to the console.
 * @param asteroids - The array of asteroids.
 */
export const printAsteroidSummary = (asteroids: Asteroid[]): void => {
  asteroids.forEach((asteroid) => {
    console.log(`- name: ${asteroid.name}`);
    console.log(`  type: ${asteroid.type}`);
    console.log(`  mass: ${asteroid.mass}`);
  });
};
