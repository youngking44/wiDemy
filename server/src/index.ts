import app from './app';
import config from 'config';
import connectDB from './db/connect';
import logger from './utils/logger.utils';

const PORT = config.get<number>('port');
const dbUri = config.get<string>('dbUri');

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
