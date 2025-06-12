package com.example.dumall.controller;

import com.example.dumall.entity.Category;
import com.example.dumall.entity.Product;
import com.example.dumall.repository.CategoryRepository;
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
@RequestMapping("/api/categories")
public class CategoryController {
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    // 获取所有分类
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        logger.info("获取所有分类");
        try {
            List<Category> categories = categoryRepository.findAll();
            logger.info("成功获取{}个分类", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("获取分类列表失败: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取单个分类
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        logger.info("获取分类, id: {}", id);
        try {
            Optional<Category> category = categoryRepository.findById(id);
            if (category.isPresent()) {
                logger.info("成功获取分类: {}", category.get().getName());
                return ResponseEntity.ok(category.get());
            } else {
                logger.warn("分类不存在, id: {}", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("获取分类详情失败, id: {}, 错误: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 获取分类下的商品
    @GetMapping("/{id}/products")
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        
        logger.info("获取分类下的商品, 分类id: {}, 页码: {}, 每页数量: {}, 排序: {}", id, page, size, sort);
        
        try {
            Optional<Category> categoryOpt = categoryRepository.findById(id);
            if (categoryOpt.isEmpty()) {
                logger.warn("分类不存在, id: {}", id);
                return ResponseEntity.notFound().build();
            }
            
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
            
            Page<Product> products = productRepository.findByActiveTrueAndCategory(categoryOpt.get(), pageable);
            logger.info("成功获取商品, 总数: {}, 总页数: {}", products.getTotalElements(), products.getTotalPages());
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("获取分类商品失败, 分类id: {}, 错误: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
} 