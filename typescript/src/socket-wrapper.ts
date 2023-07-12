import * as net from 'net';

export class SocketWrapper {
  protected buffer: Buffer | null = null;

  protected error: Error | null = null;

  protected readCallbacks: Array<(buffer: Buffer) => void> = [];

  protected socketOnDataListener: any = null;

  protected socketOnErrorListener: any = null;

  constructor(public socket: net.Socket) {
    this.socketOnErrorListener = async (error: Error) => {
      this.error = error;
    };

    this.socket.on('error', this.socketOnErrorListener);
  }

  public addListeners(): SocketWrapper {
    this.socketOnDataListener = async (data: Buffer) => {
      this.buffer = this.buffer ? Buffer.concat([this.buffer, data]) : data;
    };

    this.socket.on('data', this.socketOnDataListener);

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

        resolve();
      });
    });
  }

  public destroy(): void {
    this.removeListeners();

    this.socket.destroy();
  }

  public removeListeners(): SocketWrapper {
    if (this.socketOnDataListener) {
      this.socket.removeListener('data', this.socketOnDataListener);

      this.socketOnDataListener = null;
    }

    this.buffer = null;

    return this;
  }

  public async read(n: number): Promise<Buffer> {
    if (this.error) {
      throw this.error;
    }

    if (this.socket.destroyed) {
      throw new Error('socket has been destroyed');
    }

    if (!this.buffer) {
      throw new Error();
    }

    if (this.buffer.length === 0) {
      await this.sleep();

      return await this.read(n);
    }

    const subarray: Buffer = this.buffer.subarray(0, n);

    if (subarray.length < n) {
      await this.sleep();

      return await this.read(n);
    }

    this.buffer = this.buffer.subarray(n);

    return subarray;
  }

  protected sleep(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 5));
  }

  public async write(buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.error) {
        reject(this.error);

        return;
      }

      if (this.socket.destroyed) {
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
