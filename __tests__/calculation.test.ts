import { calculateResources, roundToTwoDecimals } from '../src/utils'; // Assuming the utility functions are in 'resource-utils.ts'
import { Asteroid, Resource } from '../src/models';

describe('calculateResources', () => {
    // Mock asteroid data for testing
    const asteroid: Asteroid = {
        name: 'Test Asteroid',
        type: 'S',
        mass: 100, // 100 million tons
    };

    it('should calculate resources correctly for a given day', () => {
        const day = 5; // Example day to calculate resources

        // Manually calculate expected resources
        const expectedResources: Resource = {
            day,
            nickel: 0,
            iron: 0,
            cobalt: 0,
            water: 0,
            nitrogen: 0,
            ammonia: 0
        };

        // Updated composition for asteroid type 'S'
        const composition = {
            nickel: 0.1006,  // 10.06%
            iron: 0.2049,   // 20.49%
            cobalt: 0.3557, // 35.57%
            water: 0.0034,  // 0.34%
            nitrogen: 0.0807, // 8.07%
            ammonia: 0.255  // 25.50%
        };

        // Simulate the resource calculation as per the function's logic
        const setupDays = Math.log(asteroid.mass);
        let remainingMass = asteroid.mass;

        for (let d = 1; d <= day; d++) {
            if (d > setupDays) {
                const remainingFraction = remainingMass / asteroid.mass;
                const dailyYield = (0.04 + Math.log(remainingFraction) / 100) * asteroid.mass;
                remainingMass -= dailyYield;

                expectedResources.nickel += dailyYield * composition.nickel;
                expectedResources.iron += dailyYield * composition.iron;
                expectedResources.cobalt += dailyYield * composition.cobalt;
                expectedResources.water += dailyYield * composition.water;
                expectedResources.nitrogen += dailyYield * composition.nitrogen;
                expectedResources.ammonia += dailyYield * composition.ammonia;
            }
        }

        // Round expected resources to two decimal places
        for (const key in expectedResources) {
            expectedResources[key as keyof Resource] = roundToTwoDecimals(expectedResources[key as keyof Resource]);
        }

        // Calculate actual resources using the function under test
        const calculatedResources = calculateResources(asteroid, day);

        // Round calculated resources to two decimal places
        for (const key in calculatedResources) {
            calculatedResources[key as keyof Resource] = roundToTwoDecimals(calculatedResources[key as keyof Resource]);
        }

        // Assertions
        expect(calculatedResources).toEqual(expectedResources);
    });
});