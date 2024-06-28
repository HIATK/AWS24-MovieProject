package org.crm.movieproject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/data")
    public String getDate() {
        return "Hello from Spring Boot !";
    }
}
