package com.gameexchange.javabackend.repository;

import com.gameexchange.javabackend.entity.Gender;
import org.springframework.data.repository.CrudRepository;

public interface GenderRepository extends CrudRepository<Gender, Long> {

}
