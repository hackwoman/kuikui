-- H2数据库不支持ON DUPLICATE KEY UPDATE语法

-- 插入角色 (使用枚举值)
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- 插入默认用户 (密码: password)
INSERT INTO users (username, email, password) 
VALUES ('user', 'user@example.com', '$2a$10$bNsNPJ7K0uPlX1VQrD8GY.7JXa5zR1Mve9lHlLqWkJNT/LUqCGjIe');

-- 插入管理员 (密码: admin123)
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@example.com', '$2a$10$WGtSqQWoIWjV8A5vAZnuoeh02jFI.8V.dkNJlT.VKWyWUYdq3R3Qm');

-- 设置用户角色
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- user 拥有 ROLE_USER
INSERT INTO user_roles (user_id, role_id) VALUES (2, 1); -- admin 拥有 ROLE_USER
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2); -- admin 拥有 ROLE_ADMIN

-- 插入商品分类
INSERT INTO categories (name, description) VALUES ('手机', '最新智能手机');
INSERT INTO categories (name, description) VALUES ('笔记本电脑', '高性能笔记本电脑');
INSERT INTO categories (name, description) VALUES ('平板电脑', '各类平板电脑');
INSERT INTO categories (name, description) VALUES ('配件', '手机和电脑配件');
INSERT INTO categories (name, description) VALUES ('可穿戴设备', '智能手表和健身追踪器');

-- 插入商品
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('智能手机 Pro', '顶级智能手机，搭载最新处理器和高清摄像头', 5999.00, 100, 'https://picsum.photos/400/400?random=1', 1, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('智能手机 Lite', '轻量级智能手机，性价比极高', 2999.00, 200, 'https://picsum.photos/400/400?random=2', 1, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('超薄笔记本', '轻薄便携的高性能笔记本电脑', 7999.00, 50, 'https://picsum.photos/400/400?random=3', 2, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('游戏笔记本', '高性能游戏笔记本，搭载独立显卡', 9999.00, 30, 'https://picsum.photos/400/400?random=4', 2, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('专业平板', '专业平板电脑，支持手写笔和键盘', 4999.00, 80, 'https://picsum.photos/400/400?random=5', 3, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('无线耳机', '高品质无线蓝牙耳机，降噪功能', 999.00, 150, 'https://picsum.photos/400/400?random=6', 4, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('快速充电器', '65W快速充电器，支持多种设备', 199.00, 300, 'https://picsum.photos/400/400?random=7', 4, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('智能手表', '健康监测智能手表，支持心率和血氧监测', 1299.00, 100, 'https://picsum.photos/400/400?random=8', 5, true); 