export class LocalStorageClient {
  private readonly storage: Storage | null;

  constructor(storage: Storage | null) {
    this.storage = storage;
  }

  read<T>(key: string): T | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.warn('[LocalStorageClient] read failed', error);
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('[LocalStorageClient] write failed', error);
    }
  }
}
