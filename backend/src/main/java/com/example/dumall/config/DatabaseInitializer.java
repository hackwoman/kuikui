package com.example.dumall.config;

import com.example.dumall.entity.Role;
import com.example.dumall.entity.Role.ERole;
import com.example.dumall.entity.User;
import com.example.dumall.repository.RoleRepository;
import com.example.dumall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 初始化角色
        initRoles();
        
        // 初始化管理员账户
        initAdminUser();
    }

    private void initRoles() {
        // 如果角色表为空，则创建默认角色
        if (roleRepository.count() == 0) {
            Role userRole = new Role(ERole.ROLE_USER);
            Role adminRole = new Role(ERole.ROLE_ADMIN);
            
            roleRepository.save(userRole);
            roleRepository.save(adminRole);
            
            System.out.println("角色初始化完成。");
        }
    }

    private void initAdminUser() {
        // 如果不存在admin用户，则创建一个
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@example.com",
                    passwordEncoder.encode("admin123")
            );
            admin.setName("系统管理员");
            
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("管理员角色未找到"));
            roles.add(adminRole);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            
            System.out.println("管理员账户初始化完成。");
        }
    }
} 