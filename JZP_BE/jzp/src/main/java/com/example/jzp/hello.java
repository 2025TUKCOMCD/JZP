package com.example.jzp;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class hello {
    
    @RequestMapping("/")
    public String index() {
        return "Hello, Spring Boot!";
    }
}