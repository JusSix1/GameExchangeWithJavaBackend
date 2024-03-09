package com.gameexchange.javabackend.service;

import com.gameexchange.javabackend.entity.Gender;
import com.gameexchange.javabackend.repository.GenderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenderService {

    private final GenderRepository repository;

    public GenderService(GenderRepository repository) {
        this.repository = repository;

    }

    public Optional<Gender> findById(Long id){
        return repository.findById(id);
    }

    public List<Gender> findAll(){
        return (List<Gender>) repository.findAll();
    }

}
