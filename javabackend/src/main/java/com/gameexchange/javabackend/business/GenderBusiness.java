package com.gameexchange.javabackend.business;

import com.gameexchange.javabackend.entity.Gender;
import com.gameexchange.javabackend.service.GenderService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenderBusiness {

    private final GenderService genderService;

    public GenderBusiness(GenderService genderService) {
        this.genderService = genderService;
    }

    public List<Gender> getGender(){
        List<Gender> gender;
        gender = genderService.findAll();

        return gender;
    }

}
