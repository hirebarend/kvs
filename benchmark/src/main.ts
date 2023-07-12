import * as net from 'net';

(async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  for (let i = 0; i < 10; i++) {
    await run();
  }
})();

function run() {
  return new Promise((resolve) => {
    const socket: net.Socket = new net.Socket();

    socket.connect(1337, process.env.HOST || '20.87.234.215', () => {
      const timestamp1 = new Date().getTime();

      let n = 0;

      socket.on('data', (data: Buffer) => {
        console.log(data);

        if (n >= 1_0_000) {
          const timestamp2 = new Date().getTime();

          console.log(timestamp2 - timestamp1);
          console.log((timestamp2 - timestamp1) / 1000);
          console.log(1_0_000 / ((timestamp2 - timestamp1) / 1000));
          console.log('-----------------------------------------');

          socket.destroy();

          resolve(null);

          return;
        }

        socket.write('PING');

        n++;
      });

      socket.write('PING');
    });
  });
}
