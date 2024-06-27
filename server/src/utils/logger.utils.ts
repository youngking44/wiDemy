import logger from 'pino';

const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd-mm-yy HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

export default log;
