package com.gameexchange.javabackend.business;

import com.gameexchange.javabackend.entity.User;
import com.gameexchange.javabackend.exception.BaseException;
import com.gameexchange.javabackend.mapper.UserMapper;
import com.gameexchange.javabackend.model.MRegisterRequest;
import com.gameexchange.javabackend.model.MRegisterResponse;
import com.gameexchange.javabackend.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserBusiness {

    private final UserService userService;

    private final UserMapper userMapper;

    public UserBusiness(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    public MRegisterResponse register(MRegisterRequest request) throws BaseException {
        User user = userService.create(request);

        return userMapper.toRegisterResponse(user);
    }

}
