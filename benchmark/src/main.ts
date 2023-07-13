import * as net from 'net';
import { SocketWrapper } from './socket-wrapper';

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (let i = 0; i < 10; i++) {
    await run();
  }
})();

async function run() {
  const socket: net.Socket = new net.Socket();

  const socketWrapper: SocketWrapper = new SocketWrapper(socket);

  await socketWrapper.connect(1337, process.env.HOST || '127.0.0.1');

  await socketWrapper.addListeners();

  console.log(process.env.HOST || '127.0.0.1');

  const timestamp1 = new Date().getTime();

  for (let i = 0; i < 1_00_000; i++) {
    const key: string = `key_${i}`;
    const value: string = 'world';

    const buffer: Buffer = Buffer.concat([
      new Uint8Array([key.length]),
      Buffer.from(key),
      new Uint8Array([value.length]),
      Buffer.from(value),
    ]);

    await socketWrapper.write(buffer);

    await socketWrapper.waitForData(2);
    await socketWrapper.read(2);
  }

  const timestamp2 = new Date().getTime();

  console.log(timestamp2 - timestamp1);
  console.log((timestamp2 - timestamp1) / 1000);
  console.log(1_00_000 / ((timestamp2 - timestamp1) / 1000));
  console.log('-----------------------------------------');

  socket.destroy();
}
