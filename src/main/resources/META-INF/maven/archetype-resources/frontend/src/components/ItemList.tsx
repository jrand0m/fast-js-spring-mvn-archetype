'use client';

import { useEffect, useState } from 'react';
import { itemsApi, type Item } from '@/api/items';

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemsApi.getAll();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await itemsApi.create(newItem);
      setNewItem({ name: '', description: '' });
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const handleUpdate = async (id: number, item: Item) => {
    try {
      await itemsApi.update(id, { name: item.name, description: item.description });
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await itemsApi.delete(id);
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Items Manager</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Item</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Item
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Items ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No items yet. Create one above!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              {editingId === item.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    defaultValue={item.name}
                    className="w-full px-3 py-2 border rounded-lg"
                    onBlur={(e) => {
                      const updatedItem = { ...item, name: e.target.value };
                      handleUpdate(item.id!, updatedItem);
                    }}
                  />
                  <textarea
                    defaultValue={item.description}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    onBlur={(e) => {
                      const updatedItem = { ...item, description: e.target.value };
                      handleUpdate(item.id!, updatedItem);
                    }}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => setEditingId(item.id!)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
