class Persistence {
  static setItem(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
    console.log("setItem", key, value);
  }

  static getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    console.log("getItem", key, item);
    return item ? JSON.parse(item) : null;
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

export default Persistence;
