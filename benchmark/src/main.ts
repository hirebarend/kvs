import * as net from 'net';
import { createClient } from 'redis';
import * as uuid from 'uuid';

async function set(
  socket: net.Socket,
  key: string,
  value: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const str: string = `*3\r\n$3\r\nSET\r\n$${key.length}\r\n${key}\r\n$${value.length}\r\n${value}\r\n`;

    const fn = (data: Buffer) => {
      socket.removeListener('data', fn);

      resolve();
    };

    socket.on('data', fn);

    socket.write(str);
  });
}

async function run_raw(n: number): Promise<void> {
  const address: string = '20.164.120.239';
  const port: number = 6379;

  const socket: net.Socket = new net.Socket();

  await new Promise((resolve, reject) => {
    const socketOnErrorListener = (error: Error) => {
      socket.removeListener('error', socketOnErrorListener);

      reject(error);
    };

    socket.on('error', socketOnErrorListener);

    socket.connect(port, address, async () => {
      socket.removeListener('error', socketOnErrorListener);

      resolve(null);
    });
  });

  const timestamp1: number = new Date().getTime();

  for (let i = 0; i < n; i++) {
    const key: string = uuid.v4().substring(0, 7);
    const value: string = uuid.v4().substring(0, 7);

    await set(socket, key, value);
  }

  const timestamp2: number = new Date().getTime();

  socket.destroy();

  console.log(`${timestamp2 - timestamp1}ms`);
  console.log(`${(timestamp2 - timestamp1) / 1000}s`);
  console.log(`${n / ((timestamp2 - timestamp1) / 1000)}`);
  console.log(`-------------------`);
}

async function run(n: number): Promise<void> {
  const client = createClient({
    url: process.env.URL || 'redis://20.164.120.239:6379',
  });

  await client.connect();

  const timestamp1: number = new Date().getTime();

  for (let i = 0; i < n; i++) {
    const key: string = uuid.v4().substring(0, 7);
    const value: string = uuid.v4().substring(0, 7);

    await client.set(key, value);

    // await client.get(key);
  }

  const timestamp2: number = new Date().getTime();

  await client.disconnect();

  console.log(`${timestamp2 - timestamp1}ms`);
  console.log(`${(timestamp2 - timestamp1) / 1000}s`);
  console.log(`${n / ((timestamp2 - timestamp1) / 1000)}`);
  console.log(`-------------------`);
}

(async () => {
  for (let i = 0; i < 10; i++) {
    await run(100_000);
    // await run_raw(100_000);
  }

  // await run(100_000);
  // await run_raw(100_000);
})();
