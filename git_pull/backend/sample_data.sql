-- SAMPLE DATA FOR MAKEMYVEGGIES DATABASE
-- Insert sample categories and products for testing

-- Insert sample categories
INSERT INTO `categories` (`name`, `description`) VALUES
('Fresh Vegetables', 'Fresh and organic vegetables'),
('Fruits', 'Fresh seasonal fruits'),
('Herbs & Seasonings', 'Fresh herbs and seasonings'),
('Exotic Fruits & Veggies', 'Exotic and rare produce'),
('Organic Produce', 'Certified organic products');

-- Insert sample products
INSERT INTO `products` (`title`, `description`, `price`, `key_features`, `category_id`, `stock`, `sku`, `status`) VALUES
('Fresh Organic Tomatoes', 'Premium quality organic tomatoes, perfect for salads and cooking. Rich in vitamins and antioxidants.', 2.99, 'Organic, Fresh, Vitamin C rich, Locally sourced', 1, 50, 'VEG001', 1),
('Organic Carrots', 'Sweet and crunchy organic carrots, great for snacking or cooking. High in beta-carotene.', 1.99, 'Organic, High in beta-carotene, Crunchy, Sweet', 1, 75, 'VEG002', 1),
('Fresh Broccoli', 'Nutrient-dense fresh broccoli florets, perfect for steaming or stir-frying.', 3.49, 'High in fiber, Vitamin K rich, Fresh, Nutrient-dense', 1, 30, 'VEG003', 1),
('Red Bell Peppers', 'Crisp and colorful red bell peppers, excellent source of vitamin C.', 4.99, 'High vitamin C, Colorful, Crisp, Sweet flavor', 1, 40, 'VEG004', 1),
('Fresh Spinach', 'Baby spinach leaves, perfect for salads and smoothies. Rich in iron and vitamins.', 2.49, 'Iron rich, Baby leaves, Fresh, Versatile', 1, 60, 'VEG005', 1),

('Organic Apples', 'Crisp and sweet organic apples, perfect for snacking or baking.', 3.99, 'Organic, Crisp, Sweet, High in fiber', 2, 80, 'FRT001', 1),
('Fresh Bananas', 'Ripe yellow bananas, great source of potassium and natural energy.', 1.49, 'High potassium, Natural energy, Ripe, Sweet', 2, 100, 'FRT002', 1),
('Organic Strawberries', 'Sweet and juicy organic strawberries, perfect for desserts and snacking.', 5.99, 'Organic, Juicy, Sweet, Antioxidant rich', 2, 25, 'FRT003', 1),
('Fresh Oranges', 'Juicy navel oranges, excellent source of vitamin C and natural sweetness.', 2.99, 'High vitamin C, Juicy, Sweet, Fresh', 2, 70, 'FRT004', 1),
('Organic Blueberries', 'Antioxidant-rich organic blueberries, perfect for smoothies and baking.', 7.99, 'Organic, Antioxidant rich, Sweet, Superfood', 2, 20, 'FRT005', 1),

('Fresh Basil', 'Aromatic fresh basil leaves, perfect for Italian dishes and pesto.', 2.99, 'Aromatic, Fresh, Italian herb, Flavorful', 3, 35, 'HRB001', 1),
('Organic Cilantro', 'Fresh organic cilantro, essential for Mexican and Asian cuisines.', 1.99, 'Organic, Fresh, Aromatic, Versatile', 3, 45, 'HRB002', 1),
('Fresh Rosemary', 'Fragrant rosemary sprigs, perfect for roasting and Mediterranean dishes.', 3.49, 'Fragrant, Mediterranean, Fresh, Aromatic', 3, 25, 'HRB003', 1),

('Dragon Fruit', 'Exotic dragon fruit with unique appearance and mild sweet flavor.', 8.99, 'Exotic, Unique, Mild sweet, Antioxidant rich', 4, 15, 'EXO001', 1),
('Passion Fruit', 'Tropical passion fruit with intense flavor, perfect for desserts.', 6.99, 'Tropical, Intense flavor, Aromatic, Exotic', 4, 20, 'EXO002', 1),

('Organic Kale', 'Nutrient-dense organic kale, perfect for salads and smoothies.', 3.99, 'Organic, Nutrient-dense, Superfood, Versatile', 5, 40, 'ORG001', 1),
('Organic Sweet Potatoes', 'Sweet and nutritious organic sweet potatoes, great for roasting.', 2.79, 'Organic, Sweet, Nutritious, High in vitamins', 5, 55, 'ORG002', 1);

-- Insert sample product images
INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`) VALUES
(1, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', 1),
(2, 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400', 1),
(3, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', 1),
(4, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', 1),
(5, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 1),
(6, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400', 1),
(7, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 1),
(8, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', 1),
(9, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', 1),
(10, 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', 1),
(11, 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', 1),
(12, 'https://images.unsplash.com/photo-1583119022894-9b9a2ad8e8d4?w=400', 1),
(13, 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400', 1),
(14, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400', 1),
(15, 'https://images.unsplash.com/photo-1609501676725-7186f0a1b1ac?w=400', 1),
(16, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 1),
(17, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 1);
