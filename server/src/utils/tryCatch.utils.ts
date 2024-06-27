import { NextFunction } from 'express';

const tryCatch = (controller: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res);
  } catch (err: unknown) {
    return next(err);
  }
};

export default tryCatch;
