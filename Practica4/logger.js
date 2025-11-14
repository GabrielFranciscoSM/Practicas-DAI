import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.cli(),
  transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'General.log',
            format: winston.format.json(),
        }),
    ],
});

export default logger;
