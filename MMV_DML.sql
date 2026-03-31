---permission table insert---

INSERT INTO permissions (name,label,description,created_at,updated_at) VALUES
	 ('view.product','View Products','Can view product listings and product details','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('add.product','Add Product','Can create new products','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.product','Update Product','Can edit/update products','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.product','Delete Product','Can delete products','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.category','View Categories','Can view categories','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('add.category','Add Category','Can create new categories','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.category','Update Category','Can edit/update categories','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.category','Delete Category','Can delete categories','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.order','View Orders','Can view orders and order details','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.order','Update Order','Can update order status/details','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.order','Delete Order','Can delete/cancel orders','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.customer','View Customers','Can view customers','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.customer','Update Customer','Can update customer details','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.customer','Delete Customer','Can delete customers','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.user','View Users','Can view admin users','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('add.user','Add User','Can create admin users','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.user','Update User','Can edit admin users','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.user','Delete User','Can delete admin users','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.role','View Roles','Can view roles','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('add.role','Add Role','Can create roles','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.role','Update Role','Can edit roles','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.role','Delete Role','Can delete roles','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.permission','View Permissions','Can view permissions list','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.permission','Update Permissions','Can update permission assignments','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.newsletter','View Newsletter','Can view newsletter subscribers','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.newsletter','Update Newsletter','Can manage newsletter settings','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.discount','View Discounts','Can view discounts','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('add.discount','Add Discount','Can create discounts','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.discount','Update Discount','Can edit discounts','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.discount','Delete Discount','Can delete discounts','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.analytics','View Analytics','Can view analytics dashboards','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.content','View Content','Can view content pages/sections','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.content','Update Content','Can update content pages/sections','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.contact_message','View Contact Messages','Can view contact messages','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('update.contact_message','Update Contact Messages','Can update/mark contact messages','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('delete.contact_message','Delete Contact Messages','Can delete contact messages','2026-02-18 12:13:46','2026-02-18 12:13:46'),
	 ('view.payments','View payments','view payments','2026-02-27 18:29:34','2026-02-27 18:29:34');

----roles table insert---
INSERT INTO roles (name,label,description,created_at,updated_at) VALUES
	 ('super_admin','Super Administrator','Has full access to the system','2026-01-14 12:30:04','2026-01-14 12:30:04');


---role permission table -----

INSERT INTO role_permissions (role_id,permission_id) VALUES
	(1,1),
	(1,2),
	(1,3),
	(1,4),
	(1,5),
	(1,6),
	(1,7),
	(1,8),
	(1,9),
	(1,10),
	(1,11),
	(1,12),
	(1,13),
	(1,14),
	(1,15),
	(1,16),
	(1,17),
	(1,18),
	(1,19),
	(1,20),
	(1,21),
	(1,22),
	(1,23),
	(1,24),
	(1,25),
	(1,26),
	(1,27),
	(1,28),
	(1,29),
	(1,30),
	(1,31),
	(1,32),
	(1,33),
	(1,34),
	(1,35),
	(1,36),
	(1,37);


---super admin insert---
INSERT INTO users (first_name, last_name, email, password, phone, email_verified, number_verified, updated_at, is_active) 
VALUES ('Admin', 'User', 'admin@example.com', SHA2('admin123',256), NULL, 1, 1, NOW(), 1);



---Orders Alter Query---
ALTER TABLE orders
ADD COLUMN order_tracking_id VARCHAR(100) DEFAULT NULL;