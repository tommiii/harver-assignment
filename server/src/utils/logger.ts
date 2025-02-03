import pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'test' ? 'silent' : process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV === 'test' 
    ? undefined
    : process.env.NODE_ENV === 'production' 
      ? undefined 
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
});

export default logger; 