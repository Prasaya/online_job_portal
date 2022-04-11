import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.prettyPrint(),
    format.colorize(),
    format.timestamp({ format: 'D-M-YY HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: 'app-error.log',
      dirname: 'logs',
      level: 'error',
    }),
    new transports.File({ filename: 'app-combined.log', dirname: 'logs' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
