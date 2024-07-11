import { OrderService } from '../src/services';
import { Asteroid } from '../src/models';
import { calculateResources } from '../src/utils';

// Mock the calculateResources and roundToTwoDecimals functions
jest.mock('../src/utils', () => ({
    calculateResources: jest.fn(),
    roundToTwoDecimals: jest.fn((value: number) => Math.round(value * 100) / 100)
}));

describe('OrderService', () => {
    let orderService: OrderService;
    let asteroids: Asteroid[];

    beforeEach(() => {
        // Reset mocks before each test
        jest.resetAllMocks();

        // Initialize asteroids for testing
        asteroids = [
            { name: 'Asteroid1', type: 'C', mass: 1000 },
            { name: 'Asteroid2', type: 'S', mass: 1500 }
        ];

        orderService = new OrderService(asteroids);

        // Mock implementation of calculateResources
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (calculateResources as jest.Mock).mockImplementation((asteroid: Asteroid, day: number) => {
            return {
                nickel: asteroid.mass * 0.1,
                iron: asteroid.mass * 0.2,
                cobalt: asteroid.mass * 0.3,
                water: asteroid.mass * 0.4,
                nitrogen: asteroid.mass * 0.5,
                ammonia: asteroid.mass * 0.6
            };
        });
    });

    it('should calculate available resources correctly', () => {
        const day = 1;
        const availableResources = orderService['calculateAvailableResources'](day);

        expect(availableResources).toEqual({
            day,
            nickel: 250,
            iron: 500,
            cobalt: 750,
            water: 1000,
            nitrogen: 1250,
            ammonia: 1500
        });
    });
});
