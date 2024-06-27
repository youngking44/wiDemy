import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandlerMiddleware from './middleware/error';
import authRouter from './routes/auth.route';
import ErrorHandler from './utils/errorHandler.utils';

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use('/api/auth', authRouter);

app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorHandler(`Route ${req.originalUrl} not found`, 404);
  next(err);
});

app.use(errorHandlerMiddleware);

export default app;
