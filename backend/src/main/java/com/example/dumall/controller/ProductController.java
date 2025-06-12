package com.example.dumall.controller;

import com.example.dumall.entity.Product;
import com.example.dumall.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    
    @Autowired
    private ProductRepository productRepository;
    
    // 获取商品列表
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        
        logger.info("获取所有商品, 页码: {}, 每页数量: {}, 排序: {}", page, size, sort);
        
        try {
            Pageable pageable;
            if (sort != null && !sort.isEmpty()) {
                String[] sortParams = sort.split(",");
                String sortField = sortParams[0];
                Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ?
                        Sort.Direction.DESC : Sort.Direction.ASC;
                pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
                logger.info("排序参数: 字段={}, 方向={}", sortField, direction);
            } else {
                pageable = PageRequest.of(page, size);
                logger.info("使用默认排序");
            }
            
            Page<Product> products = productRepository.findByActiveTrue(pageable);
            logger.info("成功获取商品, 总数: {}, 总页数: {}", products.getTotalElements(), products.getTotalPages());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("获取商品列表失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取单个商品
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        logger.info("获取商品详情, id: {}", id);
        
        try {
            Optional<Product> product = productRepository.findById(id);
            if (product.isPresent()) {
                logger.info("成功获取商品: {}", product.get().getName());
                return ResponseEntity.ok(product.get());
            } else {
                logger.warn("商品不存在, id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("获取商品详情失败, id: {}, 错误: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 搜索商品
    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        
        logger.info("搜索商品, 关键词: {}, 页码: {}, 每页数量: {}, 排序: {}", keyword, page, size, sort);
        
        try {
            Pageable pageable;
            if (sort != null && !sort.isEmpty()) {
                String[] sortParams = sort.split(",");
                String sortField = sortParams[0];
                Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ?
                        Sort.Direction.DESC : Sort.Direction.ASC;
                pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
                logger.info("排序参数: 字段={}, 方向={}", sortField, direction);
            } else {
                pageable = PageRequest.of(page, size);
                logger.info("使用默认排序");
            }
            
            Page<Product> products = productRepository.findByActiveTrueAndNameContaining(keyword, pageable);
            logger.info("搜索结果, 总数: {}, 总页数: {}", products.getTotalElements(), products.getTotalPages());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("搜索商品失败, 关键词: {}, 错误: {}", keyword, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取精选商品
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts(
            @RequestParam(defaultValue = "6") int limit) {
        
        logger.info("获取精选商品, 数量限制: {}", limit);
        
        try {
            Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<Product> products = productRepository.findByActiveTrue(pageable);
            logger.info("成功获取精选商品, 数量: {}", products.getContent().size());
            return ResponseEntity.ok(products.getContent());
        } catch (Exception e) {
            logger.error("获取精选商品失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取最新商品
    @GetMapping("/latest")
    public ResponseEntity<List<Product>> getLatestProducts() {
        logger.info("获取最新商品");
        
        try {
            List<Product> products = productRepository.findTop8ByActiveTrueOrderByCreatedAtDesc();
            logger.info("成功获取最新商品, 数量: {}", products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("获取最新商品失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取用户自己的商品
    @GetMapping("/my")
    public ResponseEntity<List<Product>> getMyProducts() {
        logger.info("获取用户自己的商品");
        
        try {
            // 在实际应用中，这里应该获取当前登录用户的商品
            // 这里为演示返回几个固定商品
            List<Product> allProducts = productRepository.findAll();
            int resultSize = Math.min(3, allProducts.size());
            List<Product> products = allProducts.subList(0, resultSize);
            
            logger.info("成功获取用户商品, 数量: {}", products.size());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("获取用户商品失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
} 