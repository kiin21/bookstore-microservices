export class StorageService {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    get<T>(defaultValue: T): T {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    set<T>(value: T): void {
        localStorage.setItem(this.key, JSON.stringify(value));
    }

    remove(): void {
        localStorage.removeItem(this.key);
    }
  }