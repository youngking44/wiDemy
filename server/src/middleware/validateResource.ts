import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import logger from '../utils/logger.utils';

// I added this alias params to the request object to avoid errors, because if we use the
// middleware with request handler that has params types it will lead to some errors
interface IParams {
  id: string;
}

const validateResource = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e: any) {
    logger.error(e);

    const message = 'Validation error';
    res.status(400).json({ success: false, message, errors: e.errors });
  }
};

export default validateResource;
