INSERT INTO `categories` (`category_id`, `name`, `description`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Electronics', 'Electronic devices and gadgets', NULL, NOW(), NOW()),
(2, 'Fashion', 'Clothing and fashion accessories', NULL, NOW(), NOW()),
(3, 'Home & Kitchen', 'Home appliances and kitchen equipment', NULL, NOW(), NOW()),
(4, 'Mobiles', 'Smartphones and mobile phones', 1, NOW(), NOW()),
(5, 'Laptops', 'Personal and gaming laptops', 1, NOW(), NOW()),
(6, 'Men Clothing', 'Clothes for men', 2, NOW(), NOW()),
(7, 'Women Clothing', 'Clothes for women', 2, NOW(), NOW()),
(8, 'Furniture', 'Home and office furniture', 3, NOW(), NOW()),
(9, 'Kitchen Appliances', 'Kitchen related electric appliances', 3, NOW(), NOW()),
(10, 'Smartphones', 'Latest smartphones', 4, NOW(), NOW());


INSERT INTO `products` 
(`product_id`, `title`, `description`, `price`, `key_features`, `category_id`, `stock`, `sku`, `status`, `created_at`, `updated_at`)
VALUES
(1, 'iPhone 15 Pro Max', 
 'Apple iPhone 15 Pro Max with A17 Pro Chip, 256GB Storage, and advanced camera system.', 
 149999.00, 
 'A17 Pro Chip, 256GB Storage, Titanium Body, 48MP Camera', 
 10, 50, 'IP15PM-256', 1, NOW(), NOW()),

(2, 'Samsung Galaxy S24 Ultra', 
 'Samsung flagship smartphone with S-Pen, quad camera, and Snapdragon processor.', 
 139999.00, 
 '200MP Camera, 12GB RAM, S-Pen Support, 5000mAh Battery', 
 10, 40, 'SGS24U-12', 1, NOW(), NOW()),

(3, 'Dell Inspiron 15 Laptop', 
 'Dell Inspiron series laptop with Intel i5 processor and 16GB RAM.', 
 59999.00, 
 'Intel i5 12th Gen, 16GB RAM, 512GB SSD, 15.6-inch Display', 
 5, 25, 'DELL-INSP15', 1, NOW(), NOW()),

(4, 'Men Slim Fit T-Shirt', 
 'Cotton slim fit t-shirt for men, available in multiple colors.', 
 799.00, 
 '100% Cotton, Slim Fit, Breathable Material', 
 6, 200, 'MEN-TSHIRT-SLIM', 1, NOW(), NOW()),

(5, 'Women Floral Dress', 
 'Elegant floral printed dress for women suitable for casual wear.', 
 1299.00, 
 'Floral Print, Lightweight Fabric, Regular Fit', 
 7, 150, 'WOM-FLR-DRS', 1, NOW(), NOW()),

(6, 'Wooden Office Chair', 
 'Ergonomic wooden chair suitable for office and home.', 
 4999.00, 
 'Ergonomic Design, Wooden Finish, Comfortable Cushion', 
 8, 30, 'CHR-WDN-OFC', 1, NOW(), NOW()),

(7, 'Philips Air Fryer', 
 'Rapid Air Technology air fryer for healthy oil-free cooking.', 
 7999.00, 
 'Rapid Air Tech, Non-stick Basket, Low Oil Cooking', 
 9, 45, 'PHL-AIRFRY', 1, NOW(), NOW()),

(8, 'Apple MacBook Air M2', 
 'Apple MacBook Air M2 with 8GB RAM and 256GB SSD, lightweight design.', 
 104999.00, 
 'M2 Chip, 256GB SSD, 8GB RAM, 13.6-inch Retina Display', 
 5, 20, 'MBA-M2-256', 1, NOW(), NOW()),

(9, 'Realme Narzo 70 Pro', 
 'Affordable smartphone with premium features.', 
 16999.00, 
 '67W Charging, 50MP Sony IMX890 Sensor, 5000mAh Battery', 
 4, 60, 'RM-NZ70P', 1, NOW(), NOW()),

(10, 'Kitchen Mixer Grinder', 
 'High-speed mixer grinder for kitchen use with stainless steel jars.', 
 3499.00, 
 '750W Motor, 3 Steel Jars, Overload Protection', 
 9, 70, 'MIX-GRND-750', 1, NOW(), NOW());


INSERT INTO `product_images` 
(`image_id`, `product_id`, `image_url`, `is_primary`, `created_at`, `updated_at`) 
VALUES
(1, 1, 'images/products/iphone15promax_1.jpg', 1, NOW(), NOW()),
(2, 1, 'images/products/iphone15promax_2.jpg', 0, NOW(), NOW()),
(3, 1, 'images/products/iphone15promax_3.jpg', 0, NOW(), NOW()),

(4, 2, 'images/products/s24ultra_1.jpg', 1, NOW(), NOW()),
(5, 2, 'images/products/s24ultra_2.jpg', 0, NOW(), NOW()),
(6, 2, 'images/products/s24ultra_3.jpg', 0, NOW(), NOW()),

(7, 3, 'images/products/dell_inspiron15_1.jpg', 1, NOW(), NOW()),
(8, 3, 'images/products/dell_inspiron15_2.jpg', 0, NOW(), NOW()),

(9, 4, 'images/products/men_slimfit_tshirt_1.jpg', 1, NOW(), NOW()),
(10, 4, 'images/products/men_slimfit_tshirt_2.jpg', 0, NOW(), NOW()),

(11, 5, 'images/products/women_floral_dress_1.jpg', 1, NOW(), NOW()),
(12, 5, 'images/products/women_floral_dress_2.jpg', 0, NOW(), NOW()),

(13, 6, 'images/products/wooden_office_chair_1.jpg', 1, NOW(), NOW()),

(14, 7, 'images/products/philips_airfryer_1.jpg', 1, NOW(), NOW()),
(15, 7, 'images/products/philips_airfryer_2.jpg', 0, NOW(), NOW()),

(16, 8, 'images/products/macbookair_m2_1.jpg', 1, NOW(), NOW()),

(17, 9, 'images/products/realme_narzo70pro_1.jpg', 1, NOW(), NOW()),
(18, 9, 'images/products/realme_narzo70pro_2.jpg', 0, NOW(), NOW()),

(19, 10, 'images/products/kitchen_mixer_1.jpg', 1, NOW(), NOW()),
(20, 10, 'images/products/kitchen_mixer_2.jpg', 0, NOW(), NOW());



INSERT INTO `product_includes`
(`id`, `product_id`, `includes`, `created_at`, `updated_at`)
VALUES
-- iPhone 15 Pro Max
(1, 1, 'iPhone 15 Pro Max Handset', NOW(), NOW()),
(2, 1, 'USB-C Charging Cable', NOW(), NOW()),
(3, 1, 'Documentation', NOW(), NOW()),

-- Samsung Galaxy S24 Ultra
(4, 2, 'Galaxy S24 Ultra Handset', NOW(), NOW()),
(5, 2, 'S-Pen', NOW(), NOW()),
(6, 2, 'USB-C Cable', NOW(), NOW()),

-- Dell Inspiron 15 Laptop
(7, 3, 'Laptop Unit', NOW(), NOW()),
(8, 3, '65W Charger', NOW(), NOW()),
(9, 3, 'User Manual', NOW(), NOW()),

-- Men Slim Fit T-Shirt
(10, 4, 'Slim Fit T-Shirt', NOW(), NOW()),
(11, 4, 'Brand Tag', NOW(), NOW()),

-- Women Floral Dress
(12, 5, 'Floral Dress', NOW(), NOW()),
(13, 5, 'Extra Buttons Pack', NOW(), NOW()),

-- Wooden Office Chair
(14, 6, 'Chair Body', NOW(), NOW()),
(15, 6, 'Cushion Set', NOW(), NOW()),
(16, 6, 'Assembly Toolkit', NOW(), NOW()),

-- Philips Air Fryer
(17, 7, 'Air Fryer Unit', NOW(), NOW()),
(18, 7, 'Non-stick Basket', NOW(), NOW()),
(19, 7, 'Instruction Manual', NOW(), NOW()),

-- MacBook Air M2
(20, 8, 'MacBook Air M2', NOW(), NOW()),
(21, 8, '30W USB-C Power Adapter', NOW(), NOW()),
(22, 8, 'USB-C to MagSafe Cable', NOW(), NOW()),

-- Realme Narzo 70 Pro
(23, 9, 'Narzo 70 Pro Handset', NOW(), NOW()),
(24, 9, '67W Fast Charger', NOW(), NOW()),
(25, 9, 'Transparent Case', NOW(), NOW()),

-- Kitchen Mixer Grinder
(26, 10, 'Mixer Motor Unit', NOW(), NOW()),
(27, 10, '3 Stainless Steel Jars', NOW(), NOW()),
(28, 10, 'Spatula', NOW(), NOW());


