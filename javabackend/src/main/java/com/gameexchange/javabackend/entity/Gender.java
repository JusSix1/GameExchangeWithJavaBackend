package com.gameexchange.javabackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity(name = "gender")
public class Gender extends BaseEntity{

    @Column()
    private String gender_name;

}
