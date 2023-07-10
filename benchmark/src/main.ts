import { createClient } from 'redis';
import * as uuid from 'uuid';

async function run(n: number): Promise<void> {
  const client = createClient({
    url: process.env.URL || 'redis://20.87.121.24:6379',
  });

  await client.connect();

  const timestamp1: number = new Date().getTime();

  for (let i = 0; i < n; i++) {
    const key: string = uuid.v4();
    const value: string = uuid.v4();

    await client.set(key, value);

    await client.get(key);
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
  }
})();
