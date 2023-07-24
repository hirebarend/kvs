import * as grpc from '@grpc/grpc-js';
import * as grpcProtoLoader from '@grpc/proto-loader';
import * as os from 'os';
import * as path from 'path';
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
  const packageDefinition = await grpcProtoLoader.load(
    path.join(__dirname, '../protos/operation.proto'),
    {},
  );
  const packageObject: any = grpc.loadPackageDefinition(packageDefinition);

  const operations = new packageObject.Operations(
    `${process.env.HOST || process.argv[2] || '127.0.0.1'}:1337`,
    grpc.credentials.createInsecure(),
  );

  await new Promise((resolve, reject) =>
    operations.set(
      {
        key: 'hello',
        value: 'world',
      },
      (error: any, result: any) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(result);
      },
    ),
  );

  const arr: Array<[string, string]> = [];

  for (let i = 0; i < n; i++) {
    arr.push([uuid.v4(), uuid.v4()]);
  }

  const timestamp1 = new Date().getTime();

  for (let i = 0; i < n; i++) {
    const key: string = arr[i][0];

    await new Promise((resolve, reject) =>
      operations.set(
        {
          key,
          value: arr[i][1],
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(result);
        },
      ),
    );

    await new Promise((resolve, reject) =>
      operations.get(
        {
          key,
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(result);
        },
      ),
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
