import * as net from 'net';
import * as uuid from 'uuid';
import { SocketWrapper } from './socket-wrapper';

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (let i = 0; i < 10; i++) {
    await run();
  }
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

async function run() {
  const socket: net.Socket = new net.Socket();

  const socketWrapper: SocketWrapper = new SocketWrapper(socket);

  await socketWrapper.connect(
    1337,
    process.env.HOST || process.argv[1] || '127.0.0.1',
  );

  await socketWrapper.addListeners();

  console.log(process.env.HOST || process.argv[1] || '127.0.0.1');

  const timestamp1 = new Date().getTime();

  for (let i = 0; i < 1_00_000; i++) {
    const key: string = uuid.v4();
    const value: string = uuid.v4();

    await set(socketWrapper, key, value);

    await get(socketWrapper, key);
  }

  const timestamp2 = new Date().getTime();

  console.log(timestamp2 - timestamp1);
  console.log((timestamp2 - timestamp1) / 1000);
  console.log(1_00_000 / ((timestamp2 - timestamp1) / 1000));
  console.log('-----------------------------------------');

  socket.destroy();
}
