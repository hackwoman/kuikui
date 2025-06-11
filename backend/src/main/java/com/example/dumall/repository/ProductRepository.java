package com.example.dumall.repository;

import com.example.dumall.entity.Category;
import com.example.dumall.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByActiveTrueAndNameContaining(String name, Pageable pageable);
    Page<Product> findByActiveTrueAndCategory(Category category, Pageable pageable);
    List<Product> findTop8ByActiveTrueOrderByCreatedAtDesc();
} 