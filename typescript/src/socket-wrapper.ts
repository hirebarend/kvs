import * as net from 'net';

export class SocketWrapper {
  protected buffer: Buffer | null = null;

  protected error: Error | null = null;

  protected waitForDataCallbacks: Array<() => void> = [];

  protected socketOnCloseListener: any = null;

  protected socketOnDataListener: any = null;

  protected socketOnErrorListener: any = null;

  constructor(
    public socket: net.Socket,
    public connected: boolean = false,
  ) {}

  public addListeners(): SocketWrapper {
    this.socketOnCloseListener = async () => {
      for (const waitForDataCallback of this.waitForDataCallbacks) {
        waitForDataCallback();
      }

      this.waitForDataCallbacks = [];
    };

    this.socket.on('close', this.socketOnCloseListener);

    this.socketOnDataListener = async (data: Buffer) => {
      this.buffer = this.buffer ? Buffer.concat([this.buffer, data]) : data;

      for (const waitForDataCallback of this.waitForDataCallbacks) {
        waitForDataCallback();
      }

      this.waitForDataCallbacks = [];
    };

    this.socket.on('data', this.socketOnDataListener);

    this.socketOnErrorListener = async (error: Error) => {
      this.error = error;

      for (const waitForDataCallback of this.waitForDataCallbacks) {
        waitForDataCallback();
      }

      this.waitForDataCallbacks = [];
    };

    this.socket.on('error', this.socketOnErrorListener);

    this.buffer = Buffer.from([]);

    return this;
  }

  public connect(port: number, address: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const socketOnErrorListener = (error: Error) => {
        this.socket.removeListener('error', socketOnErrorListener);

        reject(error);
      };

      this.socket.on('error', socketOnErrorListener);

      this.socket.connect(port, address, async () => {
        this.socket.removeListener('error', socketOnErrorListener);

        this.connected = true;

        resolve();
      });
    });
  }

  public destroy(): void {
    for (const waitForDataCallback of this.waitForDataCallbacks) {
      waitForDataCallback();
    }

    this.waitForDataCallbacks = [];

    this.removeListeners();

    this.socket.destroy();
  }

  public removeListeners(): SocketWrapper {
    if (this.socketOnCloseListener) {
      this.socket.removeListener('close', this.socketOnCloseListener);

      this.socketOnCloseListener = null;
    }

    if (this.socketOnDataListener) {
      this.socket.removeListener('data', this.socketOnDataListener);

      this.socketOnDataListener = null;
    }

    if (this.socketOnErrorListener) {
      this.socket.removeListener('error', this.socketOnErrorListener);

      this.socketOnErrorListener = null;
    }

    this.buffer = null;

    return this;
  }

  public async read(n: number): Promise<Buffer | null> {
    if (this.error) {
      throw this.error;
    }

    if (this.socket.destroyed || !this.connected) {
      throw new Error('socket has been destroyed');
    }

    if (!this.buffer) {
      throw new Error();
    }

    if (this.buffer.length === 0 || this.buffer.length < n) {
      return null;
    }

    const subarray: Buffer = this.buffer.subarray(0, n);

    this.buffer = this.buffer.subarray(n);

    return subarray;
  }

  public async waitForData(n: number): Promise<void> {
    if (!this.buffer) {
      throw new Error();
    }

    if (this.buffer.length >= n) {
      return;
    }

    return new Promise((resolve, reject) => {
      const fn = () => {
        if (this.error) {
          reject(this.error);

          return;
        }

        if (this.socket.destroyed || !this.connected) {
          reject(new Error('socket has been destroyed'));

          return;
        }

        if (!this.buffer) {
          reject(new Error());

          return;
        }

        if (this.buffer.length >= n) {
          resolve();

          return;
        }
      };

      this.waitForDataCallbacks.push(fn);
    });
  }

  public async write(buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.error) {
        reject(this.error);

        return;
      }

      if (this.socket.destroyed || !this.connected) {
        reject(new Error('socket has been destroyed'));

        return;
      }

      this.socket.write(buffer, (error) => {
        if (error) {
          reject(error);

          return;
        }

        resolve();
      });
    });
  }
}
