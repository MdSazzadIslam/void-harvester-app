import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const orderSchema = Joi.object({
  day: Joi.number().integer().min(1).required(),
  nickel: Joi.number().min(0).required(),
  iron: Joi.number().min(0).required(),
  cobalt: Joi.number().min(0).required(),
  water: Joi.number().min(0).required(),
  nitrogen: Joi.number().min(0).required(),
  ammonia: Joi.number().min(0).required(),
});

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { error } = orderSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  next();
};
