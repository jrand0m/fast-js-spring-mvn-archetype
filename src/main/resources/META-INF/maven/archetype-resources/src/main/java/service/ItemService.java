package ${package}.service;

import ${package}.model.Item;
import ${package}.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;

    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * Get all items
     */
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    /**
     * Get item by ID
     */
    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    /**
     * Search items by name (case-insensitive partial match)
     */
    public List<Item> searchItemsByName(String name) {
        return itemRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Create a new item
     */
    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    /**
     * Update an existing item
     */
    public Optional<Item> updateItem(Long id, Item itemDetails) {
        return itemRepository.findById(id)
                .map(item -> {
                    item.setName(itemDetails.getName());
                    item.setDescription(itemDetails.getDescription());
                    return itemRepository.save(item);
                });
    }

    /**
     * Delete an item
     */
    public boolean deleteItem(Long id) {
        return itemRepository.findById(id)
                .map(item -> {
                    itemRepository.delete(item);
                    return true;
                })
                .orElse(false);
    }

    /**
     * Check if an item exists
     */
    public boolean existsById(Long id) {
        return itemRepository.existsById(id);
    }

    /**
     * Count all items
     */
    public long countItems() {
        return itemRepository.count();
    }
}
