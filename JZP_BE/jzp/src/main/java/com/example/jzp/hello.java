package com.example.jzp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class hello {
    @GetMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello World";
    }
}