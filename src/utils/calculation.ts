import { Asteroid, Composition, Resource } from '../models';

// Composition of resources for different asteroid types
const composition: Composition = {
    C: { nickel: 0.0075, iron: 0.02, cobalt: 0.0025, water: 0.83, nitrogen: 0.085, ammonia: 0.055 },
    S: { nickel: 0.1006, iron: 0.2049, cobalt: 0.3557, water: 0.0034, nitrogen: 0.0807, ammonia: 0.255 },
    M: { nickel: 0.2495, iron: 0.203, cobalt: 0.2024, water: 0.1102, nitrogen: 0.2312, ammonia: 0.0037 },
    V: { nickel: 0.0076, iron: 0.0262, cobalt: 0.1147, water: 0.0151, nitrogen: 0.3139, ammonia: 0.5225 }
};

// Function to calculate setup days based on asteroid mass
export const calculateSetupDays = (mass: number): number => {
    // Using natural logarithm to calculate setup days
    return Math.log(mass);
};

// Function to calculate daily yield of resources from an asteroid
export const calculateDailyYield = (mass: number, remainingFraction: number): number => {
    if (remainingFraction >= 0.02) {
        // Formula to calculate daily yield adjusted based on remaining mass fraction
        return (0.04 + Math.log(remainingFraction) / 100) * mass;
    } else {
        // If remaining fraction is too low, yield is negligible
        return 0;
    }
};

// Function to round a number to two decimal places
export const roundToTwoDecimals = (num: number): number => {
    return Math.round(num * 100) / 100;
};

// Function to calculate total resources extracted from an asteroid up to a specified day
export const calculateResources = (asteroid: Asteroid, day: number): Resource => {
    // Calculate setup days for the asteroid
    const setupDays = calculateSetupDays(asteroid.mass);
    let remainingMass = asteroid.mass;
    let resources: Resource = { day: 0, nickel: 0, iron: 0, cobalt: 0, water: 0, nitrogen: 0, ammonia: 0 };

    // Iterate through each day up to the specified day
    for (let d = 1; d <= day; d++) {
        // Check if the current day is beyond the setup days
        if (d > setupDays) {
            // Calculate the remaining mass fraction
            const remainingFraction = remainingMass / asteroid.mass;
            // Calculate the daily yield of resources
            const dailyYield = calculateDailyYield(asteroid.mass, remainingFraction);
            // Reduce the remaining mass by the daily yield
            remainingMass -= dailyYield;

            // Accumulate the resources based on the asteroid's type and daily yield
            resources = {
                ...resources,
                day,
                nickel: roundToTwoDecimals(resources.nickel + dailyYield * (composition[asteroid.type]?.nickel ?? 0)),
                iron: roundToTwoDecimals(resources.iron + dailyYield * (composition[asteroid.type]?.iron ?? 0)),
                cobalt: roundToTwoDecimals(resources.cobalt + dailyYield * (composition[asteroid.type]?.cobalt ?? 0)),
                water: roundToTwoDecimals(resources.water + dailyYield * (composition[asteroid.type]?.water ?? 0)),
                nitrogen: roundToTwoDecimals(resources.nitrogen + dailyYield * (composition[asteroid.type]?.nitrogen ?? 0)),
                ammonia: roundToTwoDecimals(resources.ammonia + dailyYield * (composition[asteroid.type]?.ammonia ?? 0))
            };

        }
    }

    // Return the accumulated resources
    return resources;
};
