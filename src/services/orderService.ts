import { Asteroid, Order, Resource } from '../models';
import { calculateResources, roundToTwoDecimals } from '../utils';

export class OrderService {
    private asteroids: Asteroid[];

    constructor(asteroids: Asteroid[]) {
        this.asteroids = asteroids;
    }

    public placeOrder(orderId: string, resource: Resource): Order {
        // Calculate available and fulfilled resources based on the specified day
        const { fulfilled, unfulfilled } = this.calculateOrderFulfillment(resource);

        return {
            id: orderId,
            day: resource.day,
            fulfilled: {
                ...this.roundResourceValues(fulfilled),
                unfulfilled: this.roundResourceValues(unfulfilled)
            }
        };
    }

    private calculateOrderFulfillment(resource: Resource): { fulfilled: Resource, unfulfilled: Resource } {
        // Calculate available resources based on the specified day
        const availableResources = this.calculateAvailableResources(resource.day);

        // Calculate how much of the requested resources can be fulfilled
        return this.calculateFulfillment(availableResources, resource);
    }

    // Calculate total available resources from all asteroids for a given day
    private calculateAvailableResources(day: number): Resource {
        return this.asteroids.reduce((totalResources, asteroid) => {
            // Calculate resources available from the current asteroid for the given day
            const resources = calculateResources(asteroid, day);

            // Add the calculated resources to the totalResources
            return {
                ...totalResources,
                nickel: totalResources.nickel + resources.nickel,
                iron: totalResources.iron + resources.iron,
                cobalt: totalResources.cobalt + resources.cobalt,
                water: totalResources.water + resources.water,
                nitrogen: totalResources.nitrogen + resources.nitrogen,
                ammonia: totalResources.ammonia + resources.ammonia
            };
        }, this.initializeResource(day)); // Start with initial resources for the given day
    }

    private calculateFulfillment(available: Resource, requested: Resource): { fulfilled: Resource, unfulfilled: Resource } {
        const fulfilled: Resource = { ...requested };

        // Initialize unfulfilled resources with zeroes
        const unfulfilled: Resource = this.initializeResource(0);

        // Iterate over each resource type (nickel, iron, cobalt, etc.)
        Object.keys(requested).forEach(key => {
            const resourceKey = key as keyof Resource;

            // Check if available resources are less than requested
            if (available[resourceKey] < requested[resourceKey]) {
                // Fulfill as much as available, and mark the rest as unfulfilled
                fulfilled[resourceKey] = available[resourceKey];
                unfulfilled[resourceKey] = requested[resourceKey] - available[resourceKey];
            } else {
                // Fulfill the entire requested amount since enough resources are available
                fulfilled[resourceKey] = requested[resourceKey];
                unfulfilled[resourceKey] = 0;
            }
        });

        return { fulfilled, unfulfilled };
    }

    private roundResourceValues(resource: Resource): Omit<Resource, 'day'> {
        return {
            nickel: roundToTwoDecimals(resource.nickel),
            iron: roundToTwoDecimals(resource.iron),
            cobalt: roundToTwoDecimals(resource.cobalt),
            water: roundToTwoDecimals(resource.water),
            nitrogen: roundToTwoDecimals(resource.nitrogen),
            ammonia: roundToTwoDecimals(resource.ammonia)
        };
    }

    // Initialize a Resource object with all values set to zero except for day
    private initializeResource(day: number): Resource {
        return {
            day,
            nickel: 0,
            iron: 0,
            cobalt: 0,
            water: 0,
            nitrogen: 0,
            ammonia: 0
        };
    }
}
