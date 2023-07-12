import * as net from 'net';
import * as winston from 'winston';
import { SocketWrapper } from './socket-wrapper';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

const server = net.createServer(
  {
    noDelay: true,
  },
  async (socket: net.Socket) => {
    socket.uncork();

    // socket.on('data', (data: Buffer) => {
    //   socket.write('PONG');
    // });

    const socketWrapper: SocketWrapper = new SocketWrapper(socket);

    socketWrapper.addListeners();

    while (true) {
      await socketWrapper.read(4);

      await socketWrapper.write(Buffer.from('PONG'));
    }
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
  port: process.env.PORT ? parseInt(process.env.PORT) : 1337,
});
