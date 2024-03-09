package com.gameexchange.javabackend.api;

import com.gameexchange.javabackend.business.UserBusiness;
import com.gameexchange.javabackend.entity.User;
import com.gameexchange.javabackend.exception.BaseException;
import com.gameexchange.javabackend.model.MRegisterRequest;
import com.gameexchange.javabackend.model.MRegisterResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000/")
public class UserApi {

    private final UserBusiness business;

    public UserApi(UserBusiness business) {
        this.business = business;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody MRegisterRequest request) throws BaseException {
        MRegisterResponse massage = business.register(request);
        Map<String, Object> response = new HashMap<>();
        response.put("data", massage);
        return ResponseEntity.ok(response);
    }

}
