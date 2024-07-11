import { Request, Response, NextFunction } from 'express';
import { OrderController } from '../src/controllers';
import { OrderService } from '../src/services';
import { Order } from '../src/models';

jest.mock('../src/services/orderService');
jest.mock('../src/utils/logger');

describe('OrderController', () => {
    let orderController: OrderController;
    let mockOrderService: jest.Mocked<OrderService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNextFunction: NextFunction;

    beforeEach(() => {
        mockOrderService = new OrderService([]) as jest.Mocked<OrderService>;
        orderController = new OrderController([]);
        orderController['orderService'] = mockOrderService;

        mockRequest = {
            params: {},
            body: {},
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockNextFunction = jest.fn();
    });

    it('should return 400 if order_id is missing', () => {
        orderController.placeOrder(mockRequest as Request, mockResponse as Response, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Order id is missing' });
    });

    it('should return 400 if order_id is invalid', () => {
        mockRequest.params = { order_id: 'invalid-uuid' };

        orderController.placeOrder(mockRequest as Request, mockResponse as Response, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid order ID. Must be a valid UUID' });
    });

    it('should place order successfully and return response', () => {
        const validOrderId = '550e8400-e29b-41d4-a716-446655440000';
        const mockOrderResponse: Order = {
            id: validOrderId,
            day: 1,
            fulfilled: {
                nickel: 0,
                iron: 0,
                cobalt: 0,
                water: 0,
                nitrogen: 0,
                ammonia: 0,
                unfulfilled: {
                    nickel: 0,
                    iron: 0,
                    cobalt: 0,
                    water: 0,
                    nitrogen: 0,
                    ammonia: 0,
                },
            },
        };

        mockRequest.params = { order_id: validOrderId };
        mockOrderService.placeOrder.mockReturnValue(mockOrderResponse);

        orderController.placeOrder(mockRequest as Request, mockResponse as Response, mockNextFunction);

        expect(mockOrderService.placeOrder).toHaveBeenCalledWith(validOrderId, mockRequest.body);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockOrderResponse);
    });
});