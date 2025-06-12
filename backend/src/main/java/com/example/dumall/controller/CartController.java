package com.example.dumall.controller;

import com.example.dumall.entity.CartItem;
import com.example.dumall.entity.Product;
import com.example.dumall.entity.User;
import com.example.dumall.repository.CartItemRepository;
import com.example.dumall.repository.ProductRepository;
import com.example.dumall.repository.UserRepository;
import com.example.dumall.security.service.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    // 获取当前用户的购物车
    @GetMapping
    public ResponseEntity<?> getCart() {
        try {
            logger.info("接收到获取购物车请求");
            Long userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("获取购物车失败：用户未登录");
                return ResponseEntity.badRequest().body("用户未登录");
            }
            
            logger.info("查询用户ID={}的购物车", userId);
            List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
            logger.info("查询到{}个购物车项目", cartItems.size());
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            logger.error("获取购物车失败", e);
            return ResponseEntity.badRequest().body("获取购物车失败: " + e.getMessage());
        }
    }
    
    // 添加商品到购物车
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        try {
            logger.info("接收到添加购物车请求: {}", request);
            Long userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("添加购物车失败：用户未登录");
                return ResponseEntity.badRequest().body("用户未登录");
            }
            
            // 检查请求参数
            if (!request.containsKey("productId") || !request.containsKey("quantity")) {
                logger.warn("添加购物车失败：请求参数不完整 {}", request);
                return ResponseEntity.badRequest().body("缺少必要参数：productId或quantity");
            }
            
            logger.info("解析请求参数");
            Long productId;
            int quantity;
            
            try {
                productId = Long.valueOf(request.get("productId").toString());
                quantity = Integer.parseInt(request.get("quantity").toString());
            } catch (NumberFormatException e) {
                logger.warn("添加购物车失败：参数格式错误", e);
                return ResponseEntity.badRequest().body("参数格式错误：" + e.getMessage());
            }
            
            logger.info("查询用户信息，userId={}", userId);
            Optional<User> userOpt = userRepository.findById(userId);
            
            logger.info("查询商品信息，productId={}", productId);
            Optional<Product> productOpt = productRepository.findById(productId);
            
            if (userOpt.isEmpty() || productOpt.isEmpty()) {
                logger.warn("添加购物车失败：用户或商品不存在 (用户存在:{}, 商品存在:{})",
                        userOpt.isPresent(), productOpt.isPresent());
                return ResponseEntity.badRequest().body("用户或商品不存在");
            }
            
            User user = userOpt.get();
            Product product = productOpt.get();
            logger.info("用户和商品信息获取成功，用户名:{}, 商品名:{}", user.getUsername(), product.getName());
            
            // 检查购物车中是否已存在该商品
            logger.info("检查购物车中是否已存在该商品");
            Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndProductId(userId, productId);
            
            if (existingItemOpt.isPresent()) {
                // 更新数量
                logger.info("购物车中已存在该商品，更新数量");
                CartItem existingItem = existingItemOpt.get();
                int newQuantity = existingItem.getQuantity() + quantity;
                existingItem.setQuantity(newQuantity);
                cartItemRepository.save(existingItem);
                logger.info("商品数量已更新为: {}", newQuantity);
            } else {
                // 新增商品到购物车
                logger.info("购物车中不存在该商品，新增商品");
                CartItem cartItem = new CartItem();
                cartItem.setUser(user);
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
                cartItemRepository.save(cartItem);
                logger.info("商品已添加到购物车，数量: {}", quantity);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "商品已添加到购物车");
            logger.info("商品已成功添加到购物车");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("添加到购物车失败", e);
            return ResponseEntity.badRequest().body("添加到购物车失败: " + e.getMessage());
        }
    }
    
    // 更新购物车商品数量
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long cartItemId, @RequestBody Map<String, Object> request) {
        try {
            logger.info("接收到更新购物车请求: cartItemId={}, request={}", cartItemId, request);
            Long userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("更新购物车失败：用户未登录");
                return ResponseEntity.badRequest().body("用户未登录");
            }
            
            int quantity = Integer.parseInt(request.get("quantity").toString());
            logger.info("更新购物车商品数量为: {}", quantity);
            
            Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
            if (cartItemOpt.isEmpty() || !cartItemOpt.get().getUser().getId().equals(userId)) {
                logger.warn("更新购物车失败：购物车商品不存在或不属于当前用户");
                return ResponseEntity.badRequest().body("购物车商品不存在或不属于当前用户");
            }
            
            CartItem cartItem = cartItemOpt.get();
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
            logger.info("购物车商品数量已更新为: {}", quantity);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "购物车已更新");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新购物车失败", e);
            return ResponseEntity.badRequest().body("更新购物车失败: " + e.getMessage());
        }
    }
    
    // 从购物车中移除商品
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId) {
        try {
            logger.info("接收到移除购物车商品请求: cartItemId={}", cartItemId);
            Long userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("移除购物车商品失败：用户未登录");
                return ResponseEntity.badRequest().body("用户未登录");
            }
            
            Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
            if (cartItemOpt.isEmpty() || !cartItemOpt.get().getUser().getId().equals(userId)) {
                logger.warn("移除购物车商品失败：购物车商品不存在或不属于当前用户");
                return ResponseEntity.badRequest().body("购物车商品不存在或不属于当前用户");
            }
            
            cartItemRepository.deleteById(cartItemId);
            logger.info("商品已从购物车移除: cartItemId={}", cartItemId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "商品已从购物车移除");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("从购物车移除商品失败", e);
            return ResponseEntity.badRequest().body("从购物车移除商品失败: " + e.getMessage());
        }
    }
    
    // 清空购物车
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            logger.info("接收到清空购物车请求");
            Long userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("清空购物车失败：用户未登录");
                return ResponseEntity.badRequest().body("用户未登录");
            }
            
            cartItemRepository.deleteByUserId(userId);
            logger.info("购物车已清空: userId={}", userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "购物车已清空");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("清空购物车失败", e);
            return ResponseEntity.badRequest().body("清空购物车失败: " + e.getMessage());
        }
    }
    
    // 获取当前用户ID
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userDetails.getId();
            logger.debug("当前登录用户ID: {}", userId);
            return userId;
        }
        logger.warn("未能获取到当前用户ID，可能未登录");
        return null;
    }
} 