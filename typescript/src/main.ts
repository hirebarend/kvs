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

async function read(socketWrapper: SocketWrapper): Promise<string> {
  await socketWrapper.waitForData(1);

  const buffer1: Buffer | null = await socketWrapper.read(1);

  if (!buffer1) {
    throw new Error();
  }

  const n: number | null = buffer1.at(0) || null;

  if (!n) {
    throw new Error();
  }

  const buffer2: Buffer | null = await socketWrapper.read(n);

  if (!buffer2) {
    throw new Error();
  }

  return buffer2.toString();
}

async function write(
  socketWrapper: SocketWrapper,
  values: Array<string>,
): Promise<void> {
  const buffer: Buffer = Buffer.concat(
    values.reduce(
      (array, value) => {
        array.push(new Uint8Array([value.length]));
        array.push(Buffer.from(value));
        return array;
      },
      [] as Array<Buffer | Uint8Array>,
    ),
  );

  await socketWrapper.write(buffer);
}

const dict: { [key: string]: string } = {};

const server = net.createServer(
  {
    noDelay: true,
  },
  async (socket: net.Socket) => {
    socket.uncork();

    const socketWrapper: SocketWrapper = new SocketWrapper(socket, true);

    socketWrapper.addListeners();

    while (socketWrapper.connected) {
      try {
        const command: string | undefined = await read(socketWrapper);

        if (!command) {
          throw new Error();
        }

        if (command === 'GET') {
          const key: string = await read(socketWrapper);

          const value: string = dict[key];

          await write(socketWrapper, [value || 'NULL']);

          continue;
        }

        if (command === 'SET') {
          const key: string = await read(socketWrapper);

          const value: string = await read(socketWrapper);

          dict[key] = value;

          await write(socketWrapper, ['OK']);

          continue;
        }
      } catch {}
    }

    socketWrapper.destroy();
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
