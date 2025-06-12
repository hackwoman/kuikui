package com.example.dumall.controller;

import com.example.dumall.dto.request.LoginRequest;
import com.example.dumall.dto.request.RegisterRequest;
import com.example.dumall.dto.response.JwtResponse;
import com.example.dumall.dto.response.MessageResponse;
import com.example.dumall.entity.Role;
import com.example.dumall.entity.User;
import com.example.dumall.repository.RoleRepository;
import com.example.dumall.repository.UserRepository;
import com.example.dumall.security.jwt.JwtUtils;
import com.example.dumall.security.service.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("用户登录请求: {}", loginRequest.getUsername());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            logger.info("用户 {} 登录成功", loginRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (Exception e) {
            logger.error("登录失败: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageResponse("登录失败: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            logger.info("用户注册请求: {}", registerRequest.getUsername());
            
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                logger.warn("注册失败: 用户名 {} 已被使用", registerRequest.getUsername());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("错误: 用户名已被使用!"));
            }

            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                logger.warn("注册失败: 邮箱 {} 已被使用", registerRequest.getEmail());
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("错误: 邮箱已被使用!"));
            }

            // 创建新用户
            User user = new User(registerRequest.getUsername(),
                    registerRequest.getEmail(),
                    encoder.encode(registerRequest.getPassword()));

            user.setName(registerRequest.getName());
            user.setAddress(registerRequest.getAddress());
            user.setPhone(registerRequest.getPhone());

            Set<String> strRoles = registerRequest.getRoles();
            Set<Role> roles = new HashSet<>();

            try {
                if (strRoles == null || strRoles.isEmpty()) {
                    logger.info("分配默认用户角色");
                    Role userRole = roleRepository.findByName("ROLE_USER")
                            .orElseThrow(() -> {
                                logger.error("默认角色 ROLE_USER 未找到");
                                return new RuntimeException("错误: 角色未找到.");
                            });
                    roles.add(userRole);
                } else {
                    logger.info("分配自定义角色: {}", strRoles);
                    strRoles.forEach(role -> {
                        switch (role) {
                            case "admin":
                                try {
                                    Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                                            .orElseThrow(() -> {
                                                logger.error("管理员角色 ROLE_ADMIN 未找到");
                                                return new RuntimeException("错误: 管理员角色未找到.");
                                            });
                                    roles.add(adminRole);
                                } catch (Exception e) {
                                    logger.error("获取管理员角色失败: {}", e.getMessage(), e);
                                    throw e;
                                }
                                break;
                            default:
                                try {
                                    Role userRole = roleRepository.findByName("ROLE_USER")
                                            .orElseThrow(() -> {
                                                logger.error("用户角色 ROLE_USER 未找到");
                                                return new RuntimeException("错误: 用户角色未找到.");
                                            });
                                    roles.add(userRole);
                                } catch (Exception e) {
                                    logger.error("获取用户角色失败: {}", e.getMessage(), e);
                                    throw e;
                                }
                        }
                    });
                }
            } catch (Exception e) {
                logger.error("角色分配失败: {}", e.getMessage(), e);
                return ResponseEntity.badRequest().body(new MessageResponse("错误: " + e.getMessage()));
            }

            user.setRoles(roles);
            userRepository.save(user);

            logger.info("用户 {} 注册成功", registerRequest.getUsername());
            return ResponseEntity.ok(new MessageResponse("用户注册成功!"));
        } catch (Exception e) {
            logger.error("注册失败: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageResponse("注册失败: " + e.getMessage()));
        }
    }
} 