package com.gameexchange.javabackend.api;

import com.gameexchange.javabackend.business.GenderBusiness;
import com.gameexchange.javabackend.entity.Gender;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gender")
@CrossOrigin(origins = "http://localhost:3000/")
public class GenderApi {

    private final GenderBusiness business;

    public GenderApi(GenderBusiness business) {
        this.business = business;
    }

    @GetMapping("/get-gender-list")
    public ResponseEntity<Map<String, Object>> getGender(){
        List<Gender> gender = business.getGender();
        Map<String, Object> response = new HashMap<>();
        response.put("data", gender);
        return ResponseEntity.ok(response);
    }

}
