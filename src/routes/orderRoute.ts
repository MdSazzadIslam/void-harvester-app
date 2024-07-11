import { Router } from 'express';
import { Asteroid } from '../models';
import { OrderController } from '../controllers';
import { limiter } from '../utils';
import { validateOrder } from '../middlewares';

export class OrderRoute {
    public router: Router;
    private orderController: OrderController;

    constructor(asteroids: Asteroid[]) {
        this.router = Router();
        this.orderController = new OrderController(asteroids);
        this.configRoutes();
    }

    public configRoutes() {
        /**
         * @swagger
         * /api/v1/vh/order/{order_id}:
         *   put:
         *     summary: Place an order for resources
         *     parameters:
         *       - in: path
         *         name: order_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The order ID (UUID)
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               day:
         *                 type: integer
         *                 example: 10
         *               nickel:
         *                 type: number
         *                 example: 5
         *               iron:
         *                 type: number
         *                 example: 10
         *               cobalt:
         *                 type: number
         *                 example: 2
         *               water:
         *                 type: number
         *                 example: 15
         *               nitrogen:
         *                 type: number
         *                 example: 15
         *               ammonia:
         *                 type: number
         *                 example: 12
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
         *                   example: 5
         *                 iron:
         *                   type: number
         *                   example: 10
         *                 cobalt:
         *                   type: number
         *                   example: 2
         *                 water:
         *                   type: number
         *                   example: 15
         *                 nitrogen:
         *                   type: number
         *                   example: 15
         *                 ammonia:
         *                   type: number
         *                   example: 12
         */

        this.router.put(
            '/order/:order_id',
            limiter,
            validateOrder,
            this.orderController.placeOrder
        );
    }
}
