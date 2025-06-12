-- H2数据库不支持ON DUPLICATE KEY UPDATE语法

-- 插入角色 (使用枚举值)
INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- 插入默认用户 (密码: password)
INSERT INTO users (username, email, password, name, address, phone) 
VALUES ('user', 'user@example.com', '$2a$10$bNsNPJ7K0uPlX1VQrD8GY.7JXa5zR1Mve9lHlLqWkJNT/LUqCGjIe', '普通用户', '北京市朝阳区', '13800138000');

-- 插入管理员 (密码: admin123)
INSERT INTO users (username, email, password, name, address, phone) 
VALUES ('admin', 'admin@example.com', '$2a$10$WGtSqQWoIWjV8A5vAZnuoeh02jFI.8V.dkNJlT.VKWyWUYdq3R3Qm', '管理员', '上海市浦东新区', '13900139000');

-- 设置用户角色
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- user 拥有 ROLE_USER
INSERT INTO user_roles (user_id, role_id) VALUES (2, 1); -- admin 拥有 ROLE_USER
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2); -- admin 拥有 ROLE_ADMIN

-- 插入商品分类
INSERT INTO categories (name, description) VALUES ('手表', '奢华手表系列');
INSERT INTO categories (name, description) VALUES ('包袋', '高端设计师包袋');
INSERT INTO categories (name, description) VALUES ('珠宝', '精致珠宝首饰');
INSERT INTO categories (name, description) VALUES ('服饰', '高级时装服饰');
INSERT INTO categories (name, description) VALUES ('配饰', '精品配饰系列');

-- 插入商品 - 手表系列
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('瑞士经典机械表', '瑞士制造的高级机械表，18K金表壳，蓝宝石镜面，限量发行', 68000.00, 5, 'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg', 1, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('潜水计时腕表', '专业潜水表，904L不锈钢表壳，600米防水，自动机械机芯', 42500.00, 8, 'https://images.pexels.com/photos/9978681/pexels-photo-9978681.jpeg', 1, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('女士镶钻腕表', '珍珠母贝表盘，表圈镶嵌52颗钻石，玫瑰金表带，石英机芯', 35600.00, 6, 'https://images.pexels.com/photos/9982457/pexels-photo-9982457.jpeg', 1, true);

-- 插入商品 - 包袋系列
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('经典菱格链条包', '小羊皮材质，金色五金件，经典菱格纹，内部三个独立空间', 29800.00, 10, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', 2, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('时尚手提托特包', '进口牛皮，简约设计，大容量，附赠可拆卸肩带', 18500.00, 15, 'https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg', 2, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('鳄鱼皮手拿包', '顶级喜马拉雅鳄鱼皮，手工缝制，铂金扣，内衬真丝', 155000.00, 2, 'https://images.pexels.com/photos/1936848/pexels-photo-1936848.jpeg', 2, true);

-- 插入商品 - 珠宝系列
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('钻石项链', '18K白金，主石3克拉VVS净度钻石，辅石48颗钻石，总重5.2克拉', 235000.00, 3, 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg', 3, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('祖母绿戒指', '哥伦比亚祖母绿，裸石重5.8克拉，无油级别，18K金镶嵌钻石', 186000.00, 2, 'https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg', 3, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('蓝宝石耳环', 'AAA级斯里兰卡蓝宝石，总重8.5克拉，18K白金底托，镶嵌钻石', 78500.00, 4, 'https://images.pexels.com/photos/10978476/pexels-photo-10978476.jpeg', 3, true);

-- 插入商品 - 服饰系列
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('高级定制西装', '意大利进口面料，手工裁剪，个性化定制，完美剪裁', 45800.00, 5, 'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg', 4, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('真丝礼服裙', '100%桑蚕丝，法国蕾丝点缀，手工珠绣，量身定制', 38600.00, 3, 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg', 4, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('限量版皮夹克', '顶级小羊皮，意大利手工制作，独特编号，奢华衬里', 65000.00, 2, 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg', 4, true);

-- 插入商品 - 配饰系列
INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('丝绒围巾', '100%顶级羊绒，法国手工制作，经典格纹，超柔软触感', 7500.00, 8, 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg', 5, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('手工皮带', '意大利小牛皮，手工抛光黄铜扣，精细缝线，经久耐用', 5200.00, 12, 'https://images.pexels.com/photos/46202/leather-belt-strap-belt-macro-46202.jpeg', 5, true);

INSERT INTO products (name, description, price, stock, image_url, category_id, is_active) 
VALUES ('鳄鱼皮钱包', '尼罗河鳄鱼皮，手工缝制，24K金五金件，多卡位设计', 12800.00, 5, 'https://images.pexels.com/photos/9975315/pexels-photo-9975315.jpeg', 5, true); 