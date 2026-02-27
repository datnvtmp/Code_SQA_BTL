use cooking_db;
START TRANSACTION;

-- 1️⃣ Chèn ingredients trước (vì recipe_ingredients phụ thuộc vào nó)
INSERT INTO ingredients (name, status)
VALUES 
    ('Salt', 'APPROVED'),
    ('Sugar', 'APPROVED'),
    ('Olive Oil', 'APPROVED'),
    ('Butter', 'PENDING'),
    ('Garlic', 'APPROVED'),
    ('Onion', 'APPROVED'),
    ('Tomato', 'APPROVED'),
    ('Pepper', 'APPROVED'),
    ('Chili', 'PENDING'),
    ('Fish Sauce', 'APPROVED'),
    ('Soy Sauce', 'APPROVED'),
    ('Flour', 'APPROVED'),
    ('Milk', 'APPROVED'),
    ('Egg', 'APPROVED'),
    ('Lemon', 'PENDING'),
    ('Vinegar', 'APPROVED'),
    ('Honey', 'APPROVED'),
    ('Basil', 'APPROVED'),
    ('Ginger', 'APPROVED'),
    ('Coconut Milk', 'REJECTED');

-- 2️⃣ Chèn recipes (vì steps và recipe_ingredients cần recipe_id)
INSERT INTO recipes (
    title, description, servings, prep_time, cook_time, difficulty, scope, created_at, updated_at, image_url, status, user_id
)
VALUES
('Fried Rice', 'Simple and tasty fried rice with eggs and vegetables.', 2, 10, 15, 'EASY', 'PUBLIC', NOW(), NOW(), 'https://example.com/images/fried_rice.jpg', 'APPROVED', 1),
('Pancake', 'Fluffy breakfast pancakes with syrup.', 4, 15, 10, 'VERY_EASY', 'PUBLIC', NOW(), NOW(), 'https://example.com/images/pancake.jpg', 'APPROVED', 1),
('Spaghetti Bolognese', 'Classic Italian spaghetti with tomato meat sauce.', 3, 20, 30, 'MEDIUM', 'PUBLIC', NOW(), NOW(), 'https://example.com/images/spaghetti.jpg', 'APPROVED', 1);

-- 3️⃣ Chèn steps (phụ thuộc recipe_id)
-- Steps cho Fried Rice
INSERT INTO steps (step_number, description, recipe_id)
VALUES
(1, 'Chop vegetables and prepare ingredients.', 1),
(2, 'Heat oil in pan, add garlic and onions.', 1),
(3, 'Add rice and stir-fry with soy sauce and eggs.', 1);

-- Steps cho Pancake
INSERT INTO steps (step_number, description, recipe_id)
VALUES
(1, 'Mix flour, milk, egg, and sugar in a bowl.', 2),
(2, 'Heat a pan and pour the batter.', 2),
(3, 'Flip pancake when bubbles appear and cook until golden.', 2);

-- Steps cho Spaghetti
INSERT INTO steps (step_number, description, recipe_id)
VALUES
(1, 'Boil pasta until al dente.', 3),
(2, 'Cook minced meat and add tomato sauce.', 3),
(3, 'Combine pasta and sauce, mix well, and serve hot.', 3);

-- 4️⃣ Chèn step_images (phụ thuộc step_id)
INSERT INTO step_images (step_id, image_url)
VALUES
-- Fried Rice
(1, 'https://example.com/images/fried_rice_step1.jpg'),
(2, 'https://example.com/images/fried_rice_step2.jpg'),
(3, 'https://example.com/images/fried_rice_step3.jpg'),

-- Pancake
(4, 'https://example.com/images/pancake_step1.jpg'),
(5, 'https://example.com/images/pancake_step2.jpg'),
(6, 'https://example.com/images/pancake_step3.jpg'),

-- Spaghetti
(7, 'https://example.com/images/spaghetti_step1.jpg'),
(8, 'https://example.com/images/spaghetti_step2.jpg'),
(9, 'https://example.com/images/spaghetti_step3.jpg');

-- 5️⃣ Cuối cùng mới chèn recipe_ingredients (vì cần cả recipe_id và ingredient_id)
INSERT INTO recipe_ingredients (quantity, unit, raw_name, display_order, recipe_id, ingredient_id)
VALUES
-- Fried Rice
(1.0, 'tsp', 'Salt', 1, 1, 1),
(2.0, 'pcs', 'Egg', 2, 1, 14),  -- Egg có id = 14 trong danh sách ingredients ở trên
(200.0, 'g', 'Cooked Rice', 3, 1, NULL),

-- Pancake
(100.0, 'g', 'Flour', 1, 2, 12),
(1.0, 'pcs', 'Egg', 2, 2, 14),
(2.0, 'tbsp', 'Sugar', 3, 2, 2),

-- Spaghetti
(1.0, 'tsp', 'Salt', 1, 3, 1),
(3.0, 'pcs', 'Tomato', 2, 3, 7),
(200.0, 'g', 'Pasta', 3, 3, NULL);

COMMIT;
