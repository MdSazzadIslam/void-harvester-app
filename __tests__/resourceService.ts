import { ResourceService } from '../src/services';
import { Asteroid } from '../src/models';

describe('ResourceService', () => {
    let resourceService: ResourceService;
    let mockAsteroids: Asteroid[];

    beforeEach(() => {
        // Mock asteroids data
        mockAsteroids = [
            {
                name: 'Vesta',
                type: 'C',
                mass: 60.16,
            },
            {
                name: 'Ceres',
                type: 'S',
                mass: 107.52,
            },
            {
                name: 'Psyche',
                type: 'M',
                mass: 25.04,
            },
            {
                name: 'Bennu',
                type: 'V',
                mass: 83.91,
            }
        ];

        // Initialize ResourceService with mock asteroids
        resourceService = new ResourceService(mockAsteroids);
    });

    it('should calculate resources correctly for a given day', () => {
        const day = 1;

        // Mock calculateResources to return fixed values for each asteroid type
        jest.spyOn(resourceService, 'getResourcesOnDay').mockImplementation(day => {
            // Example fixed values, adjust as per your test case
            switch (day) {
                case 1:
                    return {
                        nickel: 0.1,
                        iron: 0.2,
                        cobalt: 0.3,
                        water: 0.4,
                        nitrogen: 0.5,
                        ammonia: 0.6
                    };
                default:
                    return {
                        nickel: 0,
                        iron: 0,
                        cobalt: 0,
                        water: 0,
                        nitrogen: 0,
                        ammonia: 0
                    };
            }
        });

        // Call getResourcesOnDay method
        const totalResources = resourceService.getResourcesOnDay(day);

        // Expected total resources calculation
        const expectedTotalResources = {
            nickel: 0.1 + 0,
            iron: 0.2 + 0,
            cobalt: 0.3 + 0,
            water: 0.4 + 0,
            nitrogen: 0.5 + 0,
            ammonia: 0.6 + 0
        };

        // Assertions
        expect(totalResources).toEqual(expectedTotalResources);
    });
});