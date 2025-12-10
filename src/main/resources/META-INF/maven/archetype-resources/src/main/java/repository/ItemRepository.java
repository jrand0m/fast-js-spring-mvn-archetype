package ${package}.repository;

import ${package}.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    /**
     * Find items by name containing the given string (case-insensitive)
     */
    List<Item> findByNameContainingIgnoreCase(String name);

    /**
     * Find items by exact name match (case-insensitive)
     */
    List<Item> findByNameIgnoreCase(String name);
}
