import * as net from 'net';
import { SocketWrapper } from './socket-wrapper';

(async () => {
  const socket: net.Socket = new net.Socket();

  const socketWrapper: SocketWrapper = new SocketWrapper(socket);

  await socketWrapper.connect(1337, process.env.HOST || '127.0.0.1');

  // await socketWrapper.addListeners();

  const timestamp1 = new Date().getTime();

  let n = 0;

  socket.on('data', (data: Buffer) => {
    if (n >= 1_000) {
      const timestamp2 = new Date().getTime();

      console.log(timestamp2 - timestamp1);
      console.log((timestamp2 - timestamp1) / 1000);

      return;
    }

    socket.write('PING');

    n++;
  });

  socket.write('PING');

  // for (let i = 0; i < 1_000; i++) {
  //   await socketWrapper.write(Buffer.from('PING'));

  //   await socketWrapper.read(4);
  // }

  // const timestamp2 = new Date().getTime();

  // console.log(timestamp2 - timestamp1);
  // console.log((timestamp2 - timestamp1) / 1000);
})();
