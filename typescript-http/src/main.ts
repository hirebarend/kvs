import * as http from 'http';
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

const server = http.createServer(async (request, response) => {
  if (request.method === 'POST') {
    const body: string = await new Promise((resolve, reject) => {
      let result = '';

      request.on('data', (chunk) => {
        result += chunk;
      });

      request.on('end', () => {
        resolve(result);
      });
    });

    const json = JSON.parse(body);

    if (json.command === 'GET') {
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(200);
      response.end(JSON.stringify({ value: dict[json.key] || null }));

      return;
    }

    if (json.command === 'SET') {
      dict[json.key] = json.value;

      response.setHeader('Content-Type', 'application/json');
      response.writeHead(200);
      response.end(JSON.stringify({ status: 'OK' }));

      return;
    }
  }

  response.setHeader('Content-Type', 'application/json');
  response.writeHead(200);
  response.end(JSON.stringify({ status: 'OK' }));
});

server.listen(
  process.env.PORT ? parseInt(process.env.PORT) : 1337,
  '0.0.0.0',
  () => {
    logger.info(
      `listening on ${(server.address() as any).address}:${
        (server.address() as any).port
      }`,
    );
  },
);
