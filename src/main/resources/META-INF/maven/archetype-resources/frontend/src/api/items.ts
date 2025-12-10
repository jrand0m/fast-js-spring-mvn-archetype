const API_BASE_URL = process.env.API_BASE_URL || '/api';

export interface Item {
  id?: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export const itemsApi = {
  async getAll(): Promise<Item[]> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  },

  async getById(id: number): Promise<Item> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items/#[[${id}]]#`);
    if (!response.ok) {
      throw new Error(`Failed to fetch item #[[${id}]]#`);
    }
    return response.json();
  },

  async search(name: string): Promise<Item[]> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items/search?name=#[[${encodeURIComponent(name)}]]#`);
    if (!response.ok) {
      throw new Error('Failed to search items');
    }
    return response.json();
  },

  async create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    return response.json();
  },

  async update(id: number, item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items/#[[${id}]]#`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`Failed to update item #[[${id}]]#`);
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items/#[[${id}]]#`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete item #[[${id}]]#`);
    }
  },

  async count(): Promise<number> {
    const response = await fetch(`#[[${API_BASE_URL}]]#/items/count`);
    if (!response.ok) {
      throw new Error('Failed to get item count');
    }
    return response.json();
  },
};
