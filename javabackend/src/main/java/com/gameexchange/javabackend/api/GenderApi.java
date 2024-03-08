package com.gameexchange.javabackend.api;

import com.gameexchange.javabackend.business.GenderBusiness;
import com.gameexchange.javabackend.entity.Gender;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gender")
public class GenderApi {

    private final GenderBusiness business;

    public GenderApi(GenderBusiness business) {
        this.business = business;
    }

    @GetMapping("/get-gender-list")
    public ResponseEntity<Iterable<Gender>> getGender(){
        Iterable<Gender> response = business.getGender();
        return ResponseEntity.ok(response);
    }

}
