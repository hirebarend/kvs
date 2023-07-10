import * as net from 'net';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

const dict: { [key: string]: string } = {};

const server = net.createServer(async (socket: net.Socket) => {
  socket.on('data', (data: Buffer) => {
    const str: string = data.toString();

    const splittedStr = str.split('\r\n');

    const command: string = splittedStr[2];

    if (command === 'SET') {
      dict[splittedStr[4]] = splittedStr[6];

      socket.write('+OK\r\n');

      return;
    } else if (command === 'GET') {
      socket.write(`+${dict[splittedStr[4]]}\r\n`);

      return;
    }

    // logger.info(`${command}: ${splittedStr[4]}`);
  });
});

server.listen(process.env.PORT ? parseInt(process.env.PORT) : 6379);

logger.info(
  `listening on ${process.env.PORT ? parseInt(process.env.PORT) : 6379}`
);

// setInterval(() => {
//   logger.info(`Object.keys(dict).length: ${Object.keys(dict).length}`);
// }, 5000);
