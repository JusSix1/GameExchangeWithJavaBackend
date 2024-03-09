package com.gameexchange.javabackend.service;

import com.gameexchange.javabackend.entity.Gender;
import com.gameexchange.javabackend.entity.User;
import com.gameexchange.javabackend.exception.BaseException;
import com.gameexchange.javabackend.exception.GenderException;
import com.gameexchange.javabackend.exception.UserException;
import com.gameexchange.javabackend.model.MRegisterRequest;
import com.gameexchange.javabackend.repository.GenderRepository;
import com.gameexchange.javabackend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final GenderRepository genderRepository;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder, GenderRepository genderRepository) {
        this.userRepository = repository;
        this.passwordEncoder = passwordEncoder;
        this.genderRepository = genderRepository;
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User create(MRegisterRequest request) throws BaseException {
        if(Objects.isNull(request.getEmail())){
            throw UserException.createEmailNull();
        }

        if(Objects.isNull(request.getPassword())){
            throw UserException.createPasswordNull();
        }

        if(Objects.isNull(request.getFirst_name())){
            throw UserException.createFirstNameNull();
        }

        if(Objects.isNull(request.getLast_name())){
            throw UserException.createLastNameNull();
        }

        if(Objects.isNull(request.getPersonal_id())){
            throw UserException.createPersonalIdNull();
        }

        if(Objects.isNull(request.getProfile_name())){
            throw UserException.createProfileNameNull();
        }

        if(Objects.isNull(request.getDate_of_birth())){
            throw UserException.createDateOfBirthNull();
        }

        if(Objects.isNull(request.getPhone_number())){
            throw UserException.createPhoneNumberNull();
        }

        if(Objects.isNull(request.getAddress())){
            throw UserException.createAddressNull();
        }

        if(Objects.isNull(request.getBank_account_number())){
            throw UserException.createBankAccountNumberNull();
        }

        User entity = new User();
        entity.setEmail(request.getEmail());
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        entity.setFirst_name(request.getFirst_name());
        entity.setLast_name(request.getLast_name());
        entity.setPersonal_id(request.getPersonal_id());
        entity.setProfile_name(request.getProfile_name());
        entity.setProfile_picture(request.getProfile_picture());
        entity.setDate_of_birth(request.getDate_of_birth());
        entity.setPhone_number(request.getPhone_number());
        entity.setAddress(request.getAddress());
        entity.setBank_account_number(request.getBank_account_number());
        entity.setFacebook(request.getFacebook());
        entity.setInstagram(request.getInstagram());
        entity.setLine(request.getLine());
        Optional<Gender> genderOptional = genderRepository.findById(request.getGender_id());
        if (genderOptional.isPresent()) {
            Gender gender = genderOptional.get();
            entity.setGender(gender);
        } else {
            throw GenderException.notFound();
        }

        return userRepository.save(entity);
    }

}
