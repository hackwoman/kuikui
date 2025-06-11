-- 角色初始化
INSERT INTO roles(name) VALUES('ROLE_USER') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;

-- 商品分类初始化
INSERT INTO categories(name, description) VALUES('手机', '各类智能手机') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories(name, description) VALUES('电脑', '笔记本和台式电脑') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories(name, description) VALUES('配件', '各类电子产品配件') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO categories(name, description) VALUES('家电', '生活家用电器') ON DUPLICATE KEY UPDATE name=name; 