import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemList from '../ItemList';
import { itemsApi } from '@/api/items';

jest.mock('@/api/items');

const mockItems = [
  { id: 1, name: 'Test Item 1', description: 'Description 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, name: 'Test Item 2', description: 'Description 2', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

describe('ItemList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (itemsApi.getAll as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<ItemList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders items after loading', async () => {
    (itemsApi.getAll as jest.Mock).mockResolvedValue(mockItems);

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    (itemsApi.getAll as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
    });
  });

  it('creates new item', async () => {
    (itemsApi.getAll as jest.Mock).mockResolvedValue(mockItems);
    (itemsApi.create as jest.Mock).mockResolvedValue({
      id: 3,
      name: 'New Item',
      description: 'New Description',
    });

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Name');
    const descInput = screen.getByLabelText('Description');
    const createButton = screen.getByText('Create Item');

    fireEvent.change(nameInput, { target: { value: 'New Item' } });
    fireEvent.change(descInput, { target: { value: 'New Description' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(itemsApi.create).toHaveBeenCalledWith({
        name: 'New Item',
        description: 'New Description',
      });
    });
  });

  it('deletes item with confirmation', async () => {
    (itemsApi.getAll as jest.Mock).mockResolvedValue(mockItems);
    (itemsApi.delete as jest.Mock).mockResolvedValue(undefined);

    global.confirm = jest.fn(() => true);

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(itemsApi.delete).toHaveBeenCalledWith(1);
    });
  });

  it('does not delete item when confirmation is cancelled', async () => {
    (itemsApi.getAll as jest.Mock).mockResolvedValue(mockItems);

    global.confirm = jest.fn(() => false);

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(itemsApi.delete).not.toHaveBeenCalled();
  });

  it('displays correct item count', async () => {
    (itemsApi.getAll as jest.Mock).mockResolvedValue(mockItems);

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('Items (2)')).toBeInTheDocument();
    });
  });

  it('shows empty state when no items', async () => {
    (itemsApi.getAll as jest.Mock).mockResolvedValue([]);

    render(<ItemList />);

    await waitFor(() => {
      expect(screen.getByText('No items yet. Create one above!')).toBeInTheDocument();
    });
  });
});
