import * as grpc from '@grpc/grpc-js';
import * as grpcProtoLoader from '@grpc/proto-loader';
import * as path from 'path';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});

const dict: { [key: string]: string } = {};

(async () => {
  const packageDefinition = await grpcProtoLoader.load(
    path.join(__dirname, '../protos/operation.proto'),
    {},
  );
  const packageObject: any = grpc.loadPackageDefinition(packageDefinition);

  const server = new grpc.Server();

  server.addService(packageObject.Operations.service, {
    get: async (
      x: {
        request: {
          key: string;
        };
      },
      callback: (
        err: { code: number; message: string } | null,
        response: { value: string | null } | null,
      ) => void,
    ) => {
      callback(null, {
        value: dict[x.request.key] || null,
      });
    },
    set: async (
      x: {
        request: {
          key: string;
          value: string;
        };
      },
      callback: (
        err: { code: number; message: string } | null,
        response: { success: boolean } | null,
      ) => void,
    ) => {
      dict[x.request.key] = x.request.value;

      callback(null, {
        success: true,
      });
    },
  });

  server.bindAsync(
    `0.0.0.0:${process.env.PORT ? parseInt(process.env.PORT) : 1337}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();

      logger.info(`listening on ${server}`);
    },
  );
})();
