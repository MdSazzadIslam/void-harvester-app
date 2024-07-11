import { Request, Response, NextFunction } from 'express';
import { validateOrder } from '../src/middlewares';

describe('validateOrder middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

    beforeEach(() => {
        req = {
            body: {
                day: 1,
                nickel: 10,
                iron: 20,
                cobalt: 5,
                water: 100,
                nitrogen: 30,
                ammonia: 15,
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should pass validation for a valid order', () => {
        validateOrder(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('should return 400 error for missing required fields', () => {
        delete (req as Request).body.nickel; // Simulate missing required field

        validateOrder(req as Request, res as Response, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    message: expect.stringContaining('"nickel" is required'),
                    path: ['nickel'],
                }),
            ]),
        });
    });

    it('should return 400 error for negative values', () => {
        (req as Request).body.nickel = -10; // Simulate negative value

        validateOrder(req as Request, res as Response, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    message: expect.stringContaining('"nickel" must be greater than or equal to 0'),
                    path: ['nickel'],
                }),
            ]),
        });
    });

    it('should return 400 error for Joi validation failure', () => {
        const invalidReq = {
            body: {
                day: 'invalid', // Invalid day type to trigger Joi validation failure
            },
        };

        validateOrder(invalidReq as Request, res as Response, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.any(Array), // You can adjust the expectation based on Joi's error structure
        });
    });
});
