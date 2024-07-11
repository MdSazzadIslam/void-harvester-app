import { Asteroid, Resource } from '../models';
import { calculateResources, roundToTwoDecimals } from '../utils';

export class ResourceService {
  private asteroids: Asteroid[];
  constructor(asteroids: Asteroid[]) {
    this.asteroids = asteroids;
  }

  public getResourcesOnDay = (day: number): Omit<Resource, 'day'> => {
    let totalResources: Omit<Resource, 'day'> = { nickel: 0, iron: 0, cobalt: 0, water: 0, nitrogen: 0, ammonia: 0 };

    // Calculate resources from each asteroid for the specified day
    this.asteroids.forEach(asteroid => {
      const resources = calculateResources(asteroid, day);

      //Accumulate and round resource values
      totalResources = {
        nickel: roundToTwoDecimals(totalResources.nickel + resources.nickel),
        iron: roundToTwoDecimals(totalResources.iron + resources.iron),
        cobalt: roundToTwoDecimals(totalResources.cobalt + resources.cobalt),
        water: roundToTwoDecimals(totalResources.water + resources.water),
        nitrogen: roundToTwoDecimals(totalResources.nitrogen + resources.nitrogen),
        ammonia: roundToTwoDecimals(totalResources.ammonia + resources.ammonia)
      };
    });

    return totalResources
  }
}