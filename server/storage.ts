// Storage interface for photo editor
// Currently using in-memory storage, can be extended to use database

export interface IStorage {
  // Placeholder for future storage operations
  // (sessions, editing history, etc.)
}

export class MemStorage implements IStorage {
  constructor() {
    // In-memory storage for session data if needed
  }
}

export const storage = new MemStorage();
