package com.gameexchange.javabackend.service;

import com.gameexchange.javabackend.entity.Gender;
import com.gameexchange.javabackend.repository.GenderRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GenderService {

    private final GenderRepository repository;

    public GenderService(GenderRepository repository) {
        this.repository = repository;

    }

    public Optional<Gender> findById(String id){
        return repository.findById(id);
    }

    public Iterable<Gender> findAll(){
        return repository.findAll();
    }

}
