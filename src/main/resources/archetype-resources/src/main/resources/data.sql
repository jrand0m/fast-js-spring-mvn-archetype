-- Sample data for Item entity
-- This file is executed on application startup when spring.sql.init.mode=always

-- Insert sample items
INSERT INTO items (name, description, processed, created_at, updated_at) VALUES
    ('Sample Item 1', 'This is the first sample item demonstrating the CRUD functionality', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Sample Item 2', 'This is the second sample item with a different description', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Sample Item 3', 'Third item showcasing how the application handles multiple entries', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- You can add more sample data here as needed
-- INSERT INTO items (name, description, processed, created_at, updated_at) VALUES
--     ('Your Item', 'Your description', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
