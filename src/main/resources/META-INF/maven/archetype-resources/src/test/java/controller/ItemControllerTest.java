package ${package}.controller;

import ${package}.model.Item;
import ${package}.service.ItemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ItemController.class)
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ItemService itemService;

    @Test
    void shouldGetAllItems() throws Exception {
        Item item1 = new Item("Item 1", "Description 1");
        Item item2 = new Item("Item 2", "Description 2");

        when(itemService.getAllItems()).thenReturn(Arrays.asList(item1, item2));

        mockMvc.perform(get("/api/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Item 1"))
                .andExpect(jsonPath("$[1].name").value("Item 2"));
    }

    @Test
    void shouldGetItemById() throws Exception {
        Item item = new Item("Test Item", "Test Description");
        item.setId(1L);

        when(itemService.getItemById(1L)).thenReturn(Optional.of(item));

        mockMvc.perform(get("/api/items/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Item"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void shouldReturnNotFoundForNonExistentItem() throws Exception {
        when(itemService.getItemById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/items/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateItem() throws Exception {
        Item item = new Item("New Item", "New Description");
        item.setId(1L);

        when(itemService.createItem(any(Item.class))).thenReturn(item);

        mockMvc.perform(post("/api/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New Item\",\"description\":\"New Description\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Item"));
    }

    @Test
    void shouldUpdateItem() throws Exception {
        Item updatedItem = new Item("Updated Item", "Updated Description");
        updatedItem.setId(1L);

        when(itemService.updateItem(eq(1L), any(Item.class))).thenReturn(Optional.of(updatedItem));

        mockMvc.perform(put("/api/items/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated Item\",\"description\":\"Updated Description\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Item"));
    }

    @Test
    void shouldDeleteItem() throws Exception {
        when(itemService.deleteItem(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/items/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonExistentItem() throws Exception {
        when(itemService.deleteItem(999L)).thenReturn(false);

        mockMvc.perform(delete("/api/items/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCountItems() throws Exception {
        when(itemService.countItems()).thenReturn(5L);

        mockMvc.perform(get("/api/items/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }
}
