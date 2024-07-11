import { Request, Response, NextFunction } from 'express';
import { ResourceController } from '../src/controllers';
import { Asteroid, Resource } from '../src/models';

// Mocking ResourceService
const mockAsteroids: Asteroid[] = []; // You can define mock asteroids as needed

jest.mock('../src/services/ResourceService', () => ({
    ResourceService: jest.fn(() => ({
        getResourcesOnDay: jest.fn()
    })),
}));

describe('ResourceController', () => {
    let resourceController: ResourceController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNextFunction: jest.Mock<NextFunction>;

    beforeEach(() => {
        resourceController = new ResourceController(mockAsteroids);
        mockRequest = {
            params: { n: '1' } // Adjust params as necessary
        } as unknown as Request; // Cast to Request to satisfy TypeScript
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getResourcesByDay', () => {
        it('should return 400 if day parameter is invalid', async () => {
            mockRequest.params = { n: 'invalid' };
            resourceController.getResourcesByDay(mockRequest as Request, mockResponse as Response, mockNextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid day parameter. Only positive numbers are allowed' });
        });

        it('should return resources from cache if available', async () => {
            const mockResources: Omit<Resource, 'day'> = { nickel: 0.25, iron: 0.2, cobalt: 0.2, water: 0.11, nitrogen: 0.23, ammonia: 0 };
            const day = 1;
            resourceController['resourceCache'].set(day, { resources: mockResources, timestamp: Date.now() });

            mockRequest.params = { n: day.toString() };
            resourceController.getResourcesByDay(mockRequest as Request, mockResponse as Response, mockNextFunction);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockResources);
        });
    });
});
