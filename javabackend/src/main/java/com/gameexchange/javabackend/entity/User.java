package com.gameexchange.javabackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity(name = "m_user")
public class User extends BaseEntity{

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String first_name;

    @Column(nullable = false, length = 50)
    private String last_name;

    @Column(nullable = false, length = 13)
    private String personal_id;

    @Column(nullable = false, length = 50)
    private String profile_name;

    @Column(columnDefinition="TEXT")
    private String profile_picture;

    @Column(nullable = false)
    private Date date_of_birth;

    @Column(nullable = false)
    private String phone_number;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String bank_account_number;

    @Column()
    private String facebook;

    @Column()
    private String instagram;

    @Column()
    private String line;

    @ManyToOne
    @JoinColumn(name = "gender_id", nullable = false)
    private Gender gender;

}
