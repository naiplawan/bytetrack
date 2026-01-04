-- 002_thai_foods.up.sql
-- Local Thai food database

-- Create Thai foods table
CREATE TABLE thai_foods (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,

    -- Nutrition per serving
    calories INTEGER NOT NULL,
    protein DECIMAL(7,2) NOT NULL,
    carbs DECIMAL(7,2) NOT NULL,
    fat DECIMAL(7,2) NOT NULL,
    fiber DECIMAL(7,2),
    sugar DECIMAL(7,2),
    sodium INTEGER,

    serving_size DECIMAL(7,2) NOT NULL,
    serving_unit VARCHAR(20) DEFAULT 'g',
    emoji VARCHAR(10)
);

CREATE INDEX idx_thai_foods_category ON thai_foods(category);
CREATE INDEX idx_thai_foods_name ON thai_foods USING gin(to_tsvector('english', name || ' ' || name_en));

-- Insert 20 Thai foods
INSERT INTO thai_foods (id, name, name_en, category, calories, protein, carbs, fat, fiber, serving_size, emoji) VALUES
('th_1', 'ข้าวผัดกุ้ง', 'Fried Rice with Shrimp', 'rice', 350, 18, 45, 12, 2, 250, '🍤'),
('th_2', 'ผัดไทย', 'Pad Thai', 'noodles', 400, 15, 55, 14, 3, 300, '🍜'),
('th_3', 'แกงเขียวหวานไก่', 'Green Curry with Chicken', 'curry', 280, 25, 8, 18, 2, 200, '🍛'),
('th_4', 'ต้มยำกุ้ง', 'Tom Yum Goong', 'soup', 120, 15, 8, 3, 1, 250, '🍲'),
('th_5', 'ข้าวมันไก่', 'Hainanese Chicken Rice', 'rice', 480, 28, 55, 16, 1, 350, '🍗'),
('th_6', 'ส้มตำ', 'Papaya Salad', 'salad', 150, 3, 30, 2, 8, 200, '🥗'),
('th_7', 'ไก่ย่าง', 'Grilled Chicken', 'grilled', 250, 35, 0, 12, 0, 150, '🍖'),
('th_8', 'ผัดกะเพราหมูสับ', 'Stir-fried Basil with Minced Pork', 'stir-fry', 320, 20, 15, 22, 2, 200, '🥘'),
('th_9', 'มะม่วงข้าวเหนียว', 'Mango Sticky Rice', 'dessert', 380, 6, 70, 12, 3, 180, '🥭'),
('th_10', 'ข้าวต้มหมู', 'Rice Porridge with Pork', 'soup', 200, 15, 25, 5, 1, 300, '🍲'),
('th_11', 'ลาบหมู', 'Spicy Minced Pork Salad', 'salad', 180, 22, 5, 9, 2, 150, '🥗'),
('th_12', 'ก๋วยเตี๋ยวน้ำใส', 'Clear Noodle Soup', 'noodles', 280, 18, 35, 8, 2, 400, '🍜'),
('th_13', 'แกงมัสมั่นไก่', 'Massaman Curry with Chicken', 'curry', 350, 22, 20, 22, 3, 250, '🍛'),
('th_14', 'ข้าวขาหมู', 'Braised Pork Leg on Rice', 'rice', 550, 30, 50, 25, 1, 350, '🍖'),
('th_15', 'ยำวุ้นเส้น', 'Glass Noodle Salad', 'salad', 220, 12, 30, 6, 2, 200, '🥗'),
('th_16', 'ต้มข่าไก่', 'Chicken in Coconut Soup', 'soup', 250, 18, 8, 18, 1, 250, '🍲'),
('th_17', 'ผัดซีอิ๊ว', 'Stir-fried Noodles with Soy Sauce', 'noodles', 380, 15, 50, 14, 2, 300, '🍜'),
('th_18', 'หมูสะเต๊ะ', 'Pork Satay', 'grilled', 300, 25, 12, 18, 1, 150, '🍢'),
('th_19', 'ข้าวเหนียวหมูปิ้ง', 'Sticky Rice with Grilled Pork', 'grilled', 420, 22, 45, 18, 2, 250, '🍖'),
('th_20', 'ไข่เจียว', 'Thai Omelette', 'stir-fry', 280, 14, 2, 24, 0, 120, '🍳');
