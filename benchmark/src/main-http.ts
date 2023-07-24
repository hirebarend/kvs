import axios from 'axios';
import * as os from 'os';
import * as uuid from 'uuid';
import * as winston from 'winston';

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

  for (let i = 5; i < 11; i++) {
    await run(Math.pow(3, i));
  }
})();

async function run(n: number): Promise<number> {
  console.log(process.env.HOST || process.argv[2] || '127.0.0.1');

  await axios.post(
    `http://${process.env.HOST || process.argv[2] || '127.0.0.1'}:1337`,
    {
      command: 'SET',
      key: 'hello',
      value: 'world',
    },
  );

  const arr: Array<[string, string]> = [];

  for (let i = 0; i < n; i++) {
    arr.push([uuid.v4(), uuid.v4()]);
  }

  const timestamp1 = new Date().getTime();

  for (let i = 0; i < n; i++) {
    const key: string = arr[i][0];

    await axios.post(
      `http://${process.env.HOST || process.argv[2] || '127.0.0.1'}:1337`,
      {
        command: 'SET',
        key,
        value: arr[i][1],
      },
    );

    await axios.post(
      `http://${process.env.HOST || process.argv[2] || '127.0.0.1'}:1337`,
      {
        command: 'GET',
        key,
      },
    );
  }

  const timestamp2 = new Date().getTime();

  const milliseconds = timestamp2 - timestamp1;

  logger.info(
    `took ${milliseconds}ms for ${n} executions (${
      (milliseconds * 1000) / n
    }ns/op)`,
  );

  return timestamp2 - timestamp1;
}
