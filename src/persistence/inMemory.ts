import * as fs from "fs";
import { SignatureDevice } from "../domain/device";

const LOCK_FILE = "./data.lock";

function acquireLock(callback: any) {
  fs.open(LOCK_FILE, "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        // Lock file already exists, wait and try again
        setTimeout(() => acquireLock(callback), 100);
        return;
      }
      throw err;
    }
    callback(fd);
  });
}

function releaseLock(fd: any) {
  fs.close(fd, (err) => {
    if (err) throw err;
    fs.unlink(LOCK_FILE, (err) => {
      if (err) throw err;
    });
  });
}

export interface Persistence {
  get(id: string): Promise<SignatureDevice | undefined>;
  set(data: SignatureDevice): Promise<void>;
  del(id: string): Promise<void>;
  clear(): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(): Promise<SignatureDevice[]>;
}

class InMemoryPersistence implements Persistence {
  private data: SignatureDevice[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    acquireLock((fd: any) => {
      try {
        const data = fs.readFileSync("./data.json");
        this.data = JSON.parse(data.toString());
      } catch (err) {
        // File doesn't exist or is corrupted
        this.data = [];
      }
      releaseLock(fd);
    });
  }

  private save(): void {
    acquireLock((fd: any) => {
      const data = JSON.stringify(this.data);
      fs.writeFileSync("./data.json", data);
      releaseLock(fd);
    });
  }

  async get(id: string): Promise<SignatureDevice | undefined> {
    return this.data.find((item) => item.id === id);
  }

  async set(data: SignatureDevice): Promise<void> {
    const index = this.data.findIndex((item) => item.id === data.id);
    if (index === -1) {
      this.data.push(data);
    } else {
      this.data[index] = data;
    }
    this.save();
  }

  async del(id: string): Promise<void> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.save();
    }
  }

  async clear(): Promise<void> {
    this.data = [];
    this.save();
  }

  async delete(id: string): Promise<void> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.save();
    }
  }

  async getAll(): Promise<SignatureDevice[]> {
    return [...this.data];
  }
}

export default InMemoryPersistence;
