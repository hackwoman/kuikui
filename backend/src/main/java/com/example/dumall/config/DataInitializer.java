package com.example.dumall.config;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.dumall.entity.Category;
import com.example.dumall.entity.Product;
import com.example.dumall.entity.Role;
import com.example.dumall.entity.User;
import com.example.dumall.repository.CategoryRepository;
import com.example.dumall.repository.ProductRepository;
import com.example.dumall.repository.RoleRepository;
import com.example.dumall.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Profile("!prod")
    public CommandLineRunner initDatabase() {
        return args -> {
            log.info("开始初始化示例数据...");
            
            // 1. 创建角色
            Role roleUser = createRoleIfNotFound("ROLE_USER");
            Role roleAdmin = createRoleIfNotFound("ROLE_ADMIN");
            
            // 2. 创建用户
            if (userRepository.count() == 0) {
                // 普通用户
                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("password"));
                user.setEmail("user@example.com");
                Set<Role> userRoles = new HashSet<>();
                userRoles.add(roleUser);
                user.setRoles(userRoles);
                userRepository.save(user);
                
                // 管理员
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@example.com");
                Set<Role> adminRoles = new HashSet<>();
                adminRoles.add(roleUser);
                adminRoles.add(roleAdmin);
                admin.setRoles(adminRoles);
                userRepository.save(admin);
                
                log.info("用户数据初始化完成");
            }
            
            // 3. 创建商品分类
            if (categoryRepository.count() == 0) {
                Category phones = new Category("手机", "最新智能手机");
                Category laptops = new Category("笔记本电脑", "高性能笔记本电脑");
                Category tablets = new Category("平板电脑", "各类平板电脑");
                Category accessories = new Category("配件", "手机和电脑配件");
                Category wearables = new Category("可穿戴设备", "智能手表和健身追踪器");
                
                categoryRepository.save(phones);
                categoryRepository.save(laptops);
                categoryRepository.save(tablets);
                categoryRepository.save(accessories);
                categoryRepository.save(wearables);
                
                log.info("分类数据初始化完成");
                
                // 4. 创建商品
                if (productRepository.count() == 0) {
                    // 手机
                    Product p1 = new Product();
                    p1.setName("智能手机 Pro");
                    p1.setDescription("顶级智能手机，搭载最新处理器和高清摄像头");
                    p1.setPrice(new BigDecimal("5999.00"));
                    p1.setStock(100);
                    p1.setCategory(phones);
                    p1.setImageUrl("https://picsum.photos/400/400?random=1");
                    productRepository.save(p1);
                    
                    Product p2 = new Product();
                    p2.setName("智能手机 Lite");
                    p2.setDescription("轻量级智能手机，性价比极高");
                    p2.setPrice(new BigDecimal("2999.00"));
                    p2.setStock(200);
                    p2.setCategory(phones);
                    p2.setImageUrl("https://picsum.photos/400/400?random=2");
                    productRepository.save(p2);
                    
                    // 笔记本电脑
                    Product p3 = new Product();
                    p3.setName("超薄笔记本");
                    p3.setDescription("轻薄便携的高性能笔记本电脑");
                    p3.setPrice(new BigDecimal("7999.00"));
                    p3.setStock(50);
                    p3.setCategory(laptops);
                    p3.setImageUrl("https://picsum.photos/400/400?random=3");
                    productRepository.save(p3);
                    
                    Product p4 = new Product();
                    p4.setName("游戏笔记本");
                    p4.setDescription("高性能游戏笔记本，搭载独立显卡");
                    p4.setPrice(new BigDecimal("9999.00"));
                    p4.setStock(30);
                    p4.setCategory(laptops);
                    p4.setImageUrl("https://picsum.photos/400/400?random=4");
                    productRepository.save(p4);
                    
                    // 平板电脑
                    Product p5 = new Product();
                    p5.setName("专业平板");
                    p5.setDescription("专业平板电脑，支持手写笔和键盘");
                    p5.setPrice(new BigDecimal("4999.00"));
                    p5.setStock(80);
                    p5.setCategory(tablets);
                    p5.setImageUrl("https://picsum.photos/400/400?random=5");
                    productRepository.save(p5);
                    
                    // 配件
                    Product p6 = new Product();
                    p6.setName("无线耳机");
                    p6.setDescription("高品质无线蓝牙耳机，降噪功能");
                    p6.setPrice(new BigDecimal("999.00"));
                    p6.setStock(150);
                    p6.setCategory(accessories);
                    p6.setImageUrl("https://picsum.photos/400/400?random=6");
                    productRepository.save(p6);
                    
                    Product p7 = new Product();
                    p7.setName("快速充电器");
                    p7.setDescription("65W快速充电器，支持多种设备");
                    p7.setPrice(new BigDecimal("199.00"));
                    p7.setStock(300);
                    p7.setCategory(accessories);
                    p7.setImageUrl("https://picsum.photos/400/400?random=7");
                    productRepository.save(p7);
                    
                    // 可穿戴设备
                    Product p8 = new Product();
                    p8.setName("智能手表");
                    p8.setDescription("健康监测智能手表，支持心率和血氧监测");
                    p8.setPrice(new BigDecimal("1299.00"));
                    p8.setStock(100);
                    p8.setCategory(wearables);
                    p8.setImageUrl("https://picsum.photos/400/400?random=8");
                    productRepository.save(p8);
                    
                    log.info("商品数据初始化完成");
                }
            }
            
            log.info("示例数据初始化完成！");
        };
    }
    
    private Role createRoleIfNotFound(String name) {
        Optional<Role> roleOptional = roleRepository.findByName(name);
        if (roleOptional.isEmpty()) {
            Role role = new Role(name);
            return roleRepository.save(role);
        }
        return roleOptional.get();
    }
} 