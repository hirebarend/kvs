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
  if (process.env.NO_DELAY) {
    socket.setNoDelay();
  }

  if (process.env.UNCORK) {
    socket.uncork();
  }

  socket.on('data', (data: Buffer) => {
    try {
      const str: string = data.toString();

      const splittedStr: Array<string> = str.split('\r\n');

      const command: string = splittedStr[2];

      if (command === 'SET') {
        // dict[splittedStr[4]] = splittedStr[6];

        socket.write('+OK\r\n');

        return;
      } else if (command === 'GET') {
        // socket.write(`+${dict[splittedStr[4]]}\r\n`);

        socket.write(`+${'2089e55f-5651-433e-9060-357f1459bcce'}\r\n`);

        return;
      }
    } catch {}
  });
});

server.listen(process.env.PORT ? parseInt(process.env.PORT) : 6379);

logger.info(
  `listening on ${process.env.PORT ? parseInt(process.env.PORT) : 6379}`
);

logger.info(`NO_DELAY: ${process.env.NO_DELAY || 'false'}`);

logger.info(`UNCORK: ${process.env.UNCORK || 'false'}`);
