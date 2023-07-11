import { createClient } from 'redis';
import * as uuid from 'uuid';

async function run(n: number): Promise<void> {
  const client = createClient({
    url: process.env.URL || 'redis://127.0.0.1:6379',
  });

  await client.connect();

  const timestamp1: number = new Date().getTime();

  for (let i = 0; i < n; i++) {
    // const key: string = uuid.v4().substring(0, 7);
    // const value: string = uuid.v4().substring(0, 7);
    const key: string = uuid.v4();
    const value: string = uuid.v4();

    await client.set(key, value);

    await client.get(key);
  }

  const timestamp2: number = new Date().getTime();

  await client.disconnect();

  // console.log(`${timestamp2 - timestamp1}ms`);
  // console.log(`${(timestamp2 - timestamp1) / 1000}s`);
  console.log(`${n / ((timestamp2 - timestamp1) / 1000)} per second`);
  console.log(`-------------------`);
}

(async () => {
  console.log(process.env.URL || 'redis://127.0.0.1:6379');

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // for (let i = 0; i < 10; i++) {
  //   await run(100_000);
  // }

  await run(1000);
})();
