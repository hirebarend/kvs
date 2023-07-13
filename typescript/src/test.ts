let buffer: Buffer | null = null;

async function read_a(n: number): Promise<Buffer | null> {
  if (!buffer) {
    return null;
  }

  if (buffer.length === 0 || buffer.length < n) {
    return null;
  }

  const subarray: Buffer = buffer.subarray(0, n);

  buffer = buffer.subarray(n);

  return subarray;
}

async function read_b(n: number): Promise<Buffer | null> {
  if (!buffer) {
    return null;
  }

  if (buffer.length === 0 || buffer.length < n) {
    return null;
  }

  // <>
  if (buffer.length === n) {
    const subarray: Buffer = buffer;

    buffer = null;

    return subarray;
  }
  // </>

  const subarray: Buffer = buffer.subarray(0, n);

  buffer = buffer.subarray(n);

  return subarray;
}

function read_c(n: number): Buffer | null {
  if (!buffer) {
    return null;
  }

  if (buffer.length === 0 || buffer.length < n) {
    return null;
  }

  if (buffer.length === n) {
    const subarray: Buffer = buffer;

    buffer = null;

    return subarray;
  }

  const subarray: Buffer = buffer.subarray(0, n);

  buffer = buffer.subarray(n);

  return subarray;
}

function read_d(n: number): Buffer | null {
  if (!buffer) {
    return null;
  }

  const length: number = buffer.length;

  if (length === 0 || length < n) {
    return null;
  }

  if (length === n) {
    const subarray: Buffer = buffer;

    buffer = null;

    return subarray;
  }

  const subarray: Buffer = buffer.subarray(0, n);

  buffer = buffer.subarray(n);

  return subarray;
}

// (async () => {
//   const fns = [read_a, read_b, read_c, read_d];

//   const count: number = Number.MAX_SAFE_INTEGER / 1_00_000_000;

//   for (const fn of fns) {
//     const t1 = process.hrtime();

//     for (let i = 0; i < count; i++) {
//       buffer = Buffer.from('PING');

//       const b: Buffer | null = await fn(4);

//       if (!b || b.length === 0) {
//         throw new Error();
//       }
//     }

//     const t2 = process.hrtime(t1);
//     const elapsedMilliseconds = t2[0] * 1000 + t2[1] / 1000000;
//     const msPerOp = elapsedMilliseconds / count;

//     console.log(
//       `${fn.name} - ${Math.round(elapsedMilliseconds)} (${msPerOp * 1000})`,
//     );
//   }
// })();

console.log(
  [90535, 73260, 75724, 39989].map((x, index, self) =>
    index === 0
      ? null
      : Math.round(((x - self[index - 1]) / self[index - 1]) * 100),
  ),
);

console.log(
  [90535, 73260, 75724, 39989].map((x, index, self) =>
    index === 0 ? null : Math.round(((x - self[0]) / self[0]) * 100),
  ),
);

// 90535, 73260, 75724, 39989
