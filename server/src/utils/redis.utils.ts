import { Redis } from 'ioredis';
import logger from './logger.utils';

const redisClient = () => {
  if (process.env.REDIS_URL) {
    logger.info('Redis connected');
    return process.env.REDIS_URL;
  }

  throw new Error('Redis connection failed!');
};

export const redis = new Redis(redisClient());
