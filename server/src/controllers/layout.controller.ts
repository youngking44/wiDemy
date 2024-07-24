import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import {
  createLayout,
  getLayout,
  updateLayout,
} from '../services/layout.serivce';

// CREATE LAYOUT HANDLER
export const createLayoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const layout = await createLayout(req.body);

    res.status(201).json({ success: true, layout });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE LAYOUT HANDLER
export const updateLayoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const layout = await updateLayout(req.body);

    res.status(201).json({ success: true, layout });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// GET LAYOUT HANDLER
interface IGetLayoutRequestBody {
  type: string;
}
export const getLayoutHandler = async (
  req: Request<{}, {}, IGetLayoutRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { type } = req.body;
    const layout = await getLayout(type);

    res.status(201).json({ success: true, layout });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
