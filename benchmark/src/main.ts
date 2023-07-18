import * as net from 'net';
import * as os from 'os';
import { average } from 'simple-statistics';
import * as uuid from 'uuid';
import * as winston from 'winston';
import { SocketWrapper } from './socket-wrapper';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
    new winston.transports.File({ filename: 'log.log', level: 'info' }),
  ],
});

logger.info(`os: ${os.platform()}`);
logger.info(`arch: ${os.arch()}`);
logger.info(`cpu: ${os.cpus()[0].model} @ ${os.cpus()[0].speed / 1000}GHz`);

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const results = [];

  const n: number = 1_00_000;

  for (let i = 0; i < 10; i++) {
    results.push(await run(n));
  }

  logger.info(
    `took ${average(results)}ms for ${n} executions (${
      (average(results) * 1000) / n
    }ns/op)`,
  );
})();

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

async function get(socketWrapper: SocketWrapper, key: string): Promise<string> {
  const buffer: Buffer = Buffer.concat([
    Buffer.from('GET'),
    new Uint8Array([key.length]),
    Buffer.from(key),
  ]);

  await socketWrapper.write(buffer);

  return await read(socketWrapper);
}

async function set(
  socketWrapper: SocketWrapper,
  key: string,
  value: string,
): Promise<void> {
  const buffer: Buffer = Buffer.concat([
    Buffer.from('SET'),
    new Uint8Array([key.length]),
    Buffer.from(key),
    new Uint8Array([value.length]),
    Buffer.from(value),
  ]);

  await socketWrapper.write(buffer);

  await read(socketWrapper);
}

async function run(n: number): Promise<number> {
  console.log(process.env.HOST || process.argv[2] || '127.0.0.1');

  const socket: net.Socket = new net.Socket();

  const socketWrapper: SocketWrapper = new SocketWrapper(socket);

  await socketWrapper.connect(
    1337,
    process.env.HOST || process.argv[2] || '127.0.0.1',
  );

  await socketWrapper.addListeners();

  const arr = [];

  for (let i = 0; i < n; i++) {
    arr.push([uuid.v4(), uuid.v4()]);
  }

  const timestamp1 = new Date().getTime();

  for (let i = 0; i < n; i++) {
    const key: string = arr[i][0];

    await set(socketWrapper, key, arr[i][1]);

    await get(socketWrapper, key);
  }

  const timestamp2 = new Date().getTime();

  const milliseconds = timestamp2 - timestamp1;

  logger.info(
    `took ${milliseconds}ms for ${n} executions (${
      (milliseconds * 1000) / n
    }ns/op)`,
  );

  socketWrapper.destroy();

  return timestamp2 - timestamp1;
}
