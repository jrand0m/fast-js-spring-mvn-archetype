'use client';

import { useState, useEffect } from 'react';
import { itemsApi, Item } from '@/api/items';

export default function ItemProcessor() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await itemsApi.getAll();
      setItems(fetchedItems);

      // Auto-select first item if available
      if (fetchedItems.length > 0) {
        setSelectedItemId(fetchedItems[0].id!);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
      setMessage({ type: 'error', text: 'Failed to load items' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProcessed = async () => {
    if (!selectedItemId) {
      setMessage({ type: 'error', text: 'Please select an item' });
      return;
    }

    try {
      setProcessing(true);
      setMessage(null);

      // Call API to toggle processed flag
      const updatedItem = await itemsApi.toggleProcessed(selectedItemId);

      // Update the item in local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );

      const status = updatedItem.processed ? 'processed' : 'unprocessed';
      setMessage({
        type: 'success',
        text: `Item marked as ${status}!`
      });
    } catch (error) {
      console.error('Failed to toggle processed flag:', error);
      setMessage({ type: 'error', text: 'Failed to update item' });
    } finally {
      setProcessing(false);
    }
  };

  const selectedItem = items.find(item => item.id === selectedItemId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading items...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">No items found. Create some items first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Item Processor</h2>
        <div className="text-sm text-gray-500">
          {items.filter(i => i.processed).length} / {items.length} processed
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Combobox/Select */}
        <div className="flex flex-col gap-2">
          <label htmlFor="item-select" className="font-medium text-gray-700">
            Select Item:
          </label>
          <select
            id="item-select"
            value={selectedItemId || ''}
            onChange={(e) => setSelectedItemId(Number(e.target.value))}
            className="px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.description}
                {item.processed ? ' ✓' : ' ○'}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Item Details */}
        {selectedItem && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">Selected Item Details:</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-600 min-w-[100px]">Name:</span>
                <span className="text-gray-900">{selectedItem.name}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-600 min-w-[100px]">Description:</span>
                <span className="text-gray-900">{selectedItem.description}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-gray-600 min-w-[100px]">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedItem.processed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedItem.processed ? '✓ Processed' : '○ Not Processed'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleToggleProcessed}
          disabled={processing || !selectedItemId}
          className={`px-6 py-3 font-medium rounded-md transition-colors ${
            selectedItem?.processed
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {processing
            ? 'Processing...'
            : selectedItem?.processed
              ? 'Mark as Unprocessed'
              : 'Mark as Processed'
          }
        </button>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              item.id === selectedItemId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedItemId(item.id!)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <div className={`ml-3 flex-shrink-0 ${
                item.processed ? 'text-green-600' : 'text-gray-400'
              }`}>
                {item.processed ? '✓' : '○'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
