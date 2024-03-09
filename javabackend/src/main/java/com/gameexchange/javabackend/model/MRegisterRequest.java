package com.gameexchange.javabackend.model;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Date;

@Data
public class MRegisterRequest {

    private String email;

    private String password;

    private String first_name;

    private String last_name;

    private String personal_id;

    private String profile_name;

    private String profile_picture;

    private Date date_of_birth;

    private String phone_number;

    private String address;

    private String bank_account_number;

    private String facebook;

    private String instagram;

    private String line;

    private Long gender_id;

}
