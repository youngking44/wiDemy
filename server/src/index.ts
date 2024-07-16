import app from './app';
import config from 'config';
import connectDB from './db/connect';
import logger from './utils/logger.utils';
import { v2 as cloudinary } from 'cloudinary';

const PORT = config.get<number>('port');
const dbUri = config.get<string>('dbUri');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SEC_KEY,
});

const startServer = async () => {
  try {
    await connectDB(dbUri);
    app.listen(PORT, () => logger.info(`App running on http://www.localhost:${PORT}`));
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

startServer();
