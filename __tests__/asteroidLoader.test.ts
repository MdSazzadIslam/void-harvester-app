import * as fs from 'fs';
import * as yaml from 'yamljs';
import { Asteroid } from '../src/models';
import { loadAsteroids, printAsteroidSummary } from '../src/utils';

// Mock data
const mockAsteroids = [
    { name: 'Asteroid1', type: 'C', mass: 1000 },
    { name: 'Asteroid2', type: 'S', mass: 1500 },
];

// Mock the yamljs module
jest.mock('yamljs', () => ({
    parse: jest.fn(() => mockAsteroids),
}));

// Mock the fs module
jest.mock('fs', () => {
    const originalModule = jest.requireActual('fs');
    return {
        ...originalModule,
        createReadStream: jest.fn(() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const EventEmitter = require('events');
            const stream = new EventEmitter();
            process.nextTick(() => {
                stream.emit('data', '');
                stream.emit('end');
            });
            return stream;
        }),
    };
});

describe('loadAsteroids', () => {
    it('should load and validate asteroids from a YAML file', async () => {
        const filename = 'test.yaml';
        const asteroids = await loadAsteroids(filename);
        expect(asteroids).toHaveLength(mockAsteroids.length);
        expect(asteroids[0]).toHaveProperty('name', 'Asteroid1');
        expect(asteroids[1]).toHaveProperty('type', 'S');
    });

    it('should reject with an error if the data is invalid', async () => {
        (yaml.parse as jest.Mock).mockReturnValueOnce([
            { name: 'InvalidAsteroid', type: 'C' },
        ]);

        const filename = 'test.yaml';
        await expect(loadAsteroids(filename)).rejects.toThrow(
            'Invalid asteroid data: {"name":"InvalidAsteroid","type":"C"}'
        );
    });

    it('should reject with an error if the file cannot be read', async () => {
        (fs.createReadStream as jest.Mock).mockImplementationOnce(() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const EventEmitter = require('events');
            const stream = new EventEmitter();
            process.nextTick(() => stream.emit('error', new Error('File error')));
            return stream;
        });

        const filename = 'test.yaml';
        await expect(loadAsteroids(filename)).rejects.toThrow('File error');
    });
});

describe('printAsteroidSummary', () => {
    it('should print a summary of the asteroid data', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        printAsteroidSummary(mockAsteroids as Asteroid[]);
        expect(consoleSpy).toHaveBeenCalledWith('- name: Asteroid1');
        expect(consoleSpy).toHaveBeenCalledWith('  type: C');
        expect(consoleSpy).toHaveBeenCalledWith('  mass: 1000');
        expect(consoleSpy).toHaveBeenCalledWith('- name: Asteroid2');
        expect(consoleSpy).toHaveBeenCalledWith('  type: S');
        expect(consoleSpy).toHaveBeenCalledWith('  mass: 1500');
        consoleSpy.mockRestore();
    });
});
