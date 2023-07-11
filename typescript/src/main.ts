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

const server = net.createServer(
  {
    noDelay: true,
  },
  async (socket: net.Socket) => {
    socket.uncork();

    let n: number = 0;

    const buffer: Buffer = Buffer.alloc(128);

    socket.on('data', (data: Buffer) => {
      for (let i = 0; i < data.length; i++) {
        buffer.writeUInt8(data.readUInt8(i), n);

        n++;
      }

      const str: string = data.subarray(0, n).toString();

      const splittedStr: Array<string> = str.split('\r\n');

      const numberOfParameters: number = parseInt(splittedStr[0].substring(1));

      if (splittedStr.length < numberOfParameters * 2 + 2) {
        return;
      }

      n = 0;

      try {
        const command: string = splittedStr[2];

        if (command === 'SET') {
          dict[splittedStr[4]] = splittedStr[6];

          socket.write('+OK\r\n');

          return;
        } else if (command === 'GET') {
          socket.write(`+${dict[splittedStr[4]]}\r\n`);

          return;
        }
      } catch {}
    });
  },
);

server.on('listening', () => {
  logger.info(
    `listening on ${(server.address() as any).address}:${
      (server.address() as any).port
    }`,
  );
});

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? parseInt(process.env.PORT) : 6379,
});
