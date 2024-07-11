import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services';
import { Asteroid, Resource } from '../models';
import { logger } from '../utils';

export class ResourceController {
  private resourceService: ResourceService;
  private resourceCache: Map<number, { resources: Omit<Resource, 'day'>; timestamp: number }>;

  constructor(asteroids: Asteroid[]) {
    this.resourceService = new ResourceService(asteroids);
    this.resourceCache = new Map();
  }

  public getResourcesByDay = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { n } = req.params;
      if (!n) {
        return res.status(400).json({ error: 'The day to query for resources is missing' });
      }

      const validation = this.validateDayParameter(n);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      const day = validation.day || 0;

      const resources = this.resourceService.getResourcesOnDay(day);

      // Check cache for existing resources
      const cachedResource = this.resourceCache.get(day);
      if (cachedResource && this.isCacheValid(cachedResource.timestamp)) {
        logger.info(`[ResourceController] Serving from cache for day ${day}`);
        return res.status(200).json(cachedResource.resources);
      }

      // Update cache with new resources and timestamp
      this.resourceCache.set(day, { resources, timestamp: Date.now() });

      res.status(200).json(resources);
    } catch (error) {
      logger.error('[ResourceController] Error retrieving resources:', error);
      next(error);
    }
  };

  private isCacheValid(timestamp: number): boolean {
    const now = Date.now();
    return now - timestamp <= 60000;  // Default cache duration: 1 minute
  }

  private validateDayParameter(dayParam: string): { isValid: boolean; day?: number; error?: string } {
    const day = parseInt(dayParam, 10);
    if (isNaN(day) || day < 0) {
      return { isValid: false, error: 'Invalid day parameter. Only positive numbers are allowed' };
    }
    return { isValid: true, day };
  }


}
