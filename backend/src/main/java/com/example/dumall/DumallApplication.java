package com.example.dumall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class DumallApplication {

    public static void main(String[] args) {
        SpringApplication.run(DumallApplication.class, args);
    }
} 