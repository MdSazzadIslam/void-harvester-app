import { Router } from 'express';
import { Asteroid } from '../models';
import { ResourceController } from '../controllers';
import { limiter } from '../utils';

export class ResourceRoute {
  public router: Router;
  private resourceController: ResourceController;

  constructor(asteroids: Asteroid[]) {
    this.router = Router();
    this.resourceController = new ResourceController(asteroids);
    this.configRoutes();
  }

  public configRoutes() {
    /**
     * @swagger
     * /api/v1/vh/resources/{n}:
     *   get:
     *     summary: Get resources on a specific day
     *     parameters:
     *       - in: path
     *         name: n
     *         required: true
     *         schema:
     *           type: integer
     *         description: The day to query for resources
     *     responses:
     *       '200':
     *         description: Successful operation
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 day:
     *                   type: integer
     *                   example: 10
     *                 nickel:
     *                   type: number
     *                   example: 14.11
     *                 iron:
     *                   type: number
     *                   example: 23.89
     *                 cobalt:
     *                   type: number
     *                   example: 41.67
     *                 water:
     *                   type: number
     *                   example: 42.71
     *                 nitrogen:
     *                   type: number
     *                   example: 36.00
     *                 ammonia:
     *                   type: number
     *                   example: 58.81
     */
    this.router.get('/resources/:n', limiter, this.resourceController.getResourcesByDay);
  }
}
