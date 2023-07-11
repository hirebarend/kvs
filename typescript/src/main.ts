import * as uuid from 'uuid';

class HashTable {
  protected readonly buckets: Array<Array<{ key: string; value: string }>>;

  constructor(protected size: number = 1_000_000) {
    this.buckets = new Array(size);
  }

  protected hash(key: string): number {
    // let hash: number = 0;

    // for (let i: number = 0; i < key.length; i++) {
    //   hash += key.charCodeAt(i);
    // }

    // return hash % this.size;

    return this.hash_djb2(key);
  }

  protected hash_djb2(key: string): number {
    let hash: number = 5381;

    for (let i: number = 0; i < key.length; i++) {
      hash = (hash * 33) ^ key.charCodeAt(i);
    }

    return hash % this.size;
  }

  protected hash_fnv1a(key: string): number {
    const FNV_PRIME: number = 16777619;
    const OFFSET_BASIS: number = 2166136261;

    let hash: number = OFFSET_BASIS;

    for (let i: number = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash *= FNV_PRIME;
    }

    return hash % this.size;
  }

  protected hash_murmur2(key: string): number {
    const m = 0x5bd1e995;
    const r = 24;

    let h = 0 ^ key.length;
    let currentIndex = 0;

    while (key.length >= 4) {
      let k =
        (key.charCodeAt(currentIndex) & 0xff) |
        ((key.charCodeAt(currentIndex + 1) & 0xff) << 8) |
        ((key.charCodeAt(currentIndex + 2) & 0xff) << 16) |
        ((key.charCodeAt(currentIndex + 3) & 0xff) << 24);

      k = (k * m) & 0xffffffff;
      k = (k ^ (k >>> r)) & 0xffffffff;
      k = (k * m) & 0xffffffff;

      h = (h * m) & 0xffffffff;
      h = (h ^ k) & 0xffffffff;

      currentIndex += 4;
      key = key.slice(4);
    }

    switch (key.length) {
      case 3:
        h ^= (key.charCodeAt(2) & 0xff) << 16;
        break;
      case 2:
        h ^= (key.charCodeAt(1) & 0xff) << 8;
        break;
      case 1:
        h ^= key.charCodeAt(0) & 0xff;
        h = (h * m) & 0xffffffff;
        break;
    }

    h ^= h >>> 13;
    h = (h * m) & 0xffffffff;
    h ^= h >>> 15;

    return h >>> 0;
  }

  protected hash_murmur3(key: string): number {
    const seed: number = 0x5bd1e995;
    const uint32Max: number = 0xffffffff;

    let hash: number = 0;

    for (let i: number = 0; i < key.length; i++) {
      let ch = key.charCodeAt(i);
      hash = (hash ^ ch) & uint32Max;
      hash = (hash * seed) & uint32Max;
    }

    return hash % this.size;
  }

  public set(key: string, value: string): void {
    const index: number = this.hash(key);

    if (!this.buckets[index]) {
      this.buckets[index] = [];
    }

    for (let i: number = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i].key === key) {
        this.buckets[index][i].value = value;

        return;
      }
    }

    this.buckets[index].push({ key, value });
  }

  public get(key: string): string | null {
    const index: number = this.hash(key);

    if (!this.buckets[index]) {
      return null;
    }

    for (let i: number = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i].key === key) {
        return this.buckets[index][i].value;
      }
    }

    return null;
  }

  public delete(key: string): void {
    const index: number = this.hash(key);

    if (!this.buckets[index]) {
      return undefined;
    }

    for (let i: number = 0; i < this.buckets[index].length; i++) {
      if (this.buckets[index][i].key === key) {
        this.buckets[index].splice(i, 1);
        return;
      }
    }
  }
}

function run_1(n: number): void {
  const keys: Array<string> = [];

  const value: string = uuid.v4();

  for (let i = 0; i < n; i++) {
    keys.push(uuid.v4());
  }

  console.log('..');

  const hashTable: { [key: string]: string } = {};

  const timestamp1: number = new Date().getTime();

  for (let i = 0; i < n; i++) {
    hashTable[keys[i]] = value;
  }

  const timestamp2: number = new Date().getTime();

  console.log(`${timestamp2 - timestamp1}ms`);
  console.log(`${(timestamp2 - timestamp1) / 1000}s`);
  console.log(`${n / ((timestamp2 - timestamp1) / 1000)} per second`);
  console.log(`-------------------`);
}

function run_2(n: number): void {
  const keys: Array<string> = [];

  const value: string = uuid.v4();

  for (let i = 0; i < n; i++) {
    keys.push(uuid.v4());
  }

  console.log('..');

  const hashTable: HashTable = new HashTable();

  const timestamp1: number = new Date().getTime();

  for (let i = 0; i < n; i++) {
    hashTable.set(keys[i], value);
  }

  const timestamp2: number = new Date().getTime();

  console.log(`${timestamp2 - timestamp1}ms`);
  console.log(`${(timestamp2 - timestamp1) / 1000}s`);
  console.log(`${n / ((timestamp2 - timestamp1) / 1000)} per second`);
  console.log(`-------------------`);
}

run_1(1_000_000);
run_2(1_000_000);
