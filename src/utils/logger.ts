const winston = require('winston');


export const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'warn' }),
        new winston.transports.File({ filename: 'all.log' }),
        new winston.transports.Console()
    ],
});