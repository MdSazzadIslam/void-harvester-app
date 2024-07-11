import { Request, Response, NextFunction } from 'express';
import { validate as isUuid } from 'uuid';
import { OrderService } from '../services';
import { Asteroid } from '../models';
import { logger } from '../utils';

export class OrderController {
    private orderService: OrderService;
    constructor(asteroids: Asteroid[]) {
        this.orderService = new OrderService(asteroids);
    }

    public placeOrder = (req: Request, res: Response, next: NextFunction) => {
        const { order_id } = req.params;
        if (!order_id) {
            return res.status(400).json({ error: 'Order id is missing' });
        }

        try {
            const validationResult = this.validateOrderId(order_id);
            if (!validationResult.isValid) {
                return res.status(400).json({ error: validationResult.error });
            }

            const orderResponse = this.orderService.placeOrder(order_id, req.body);
            res.status(200).json(orderResponse);
        } catch (error) {
            logger.error('[OrderController] Error placing order:', error);
            next(error);
        }
    };

    private validateOrderId(orderId: string): { isValid: boolean; error?: string } {
        if (!isUuid(orderId)) {
            return { isValid: false, error: 'Invalid order ID. Must be a valid UUID' };
        }
        return { isValid: true };
    }

}
