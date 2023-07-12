import * as net from 'net';

(async () => {
  const socket: net.Socket = new net.Socket();

  socket.connect(1337, process.env.HOST || '127.0.0.1', () => {
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
  });
})();
