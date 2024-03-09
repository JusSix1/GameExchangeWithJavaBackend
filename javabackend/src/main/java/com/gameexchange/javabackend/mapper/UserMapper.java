package com.gameexchange.javabackend.mapper;

import com.gameexchange.javabackend.entity.User;
import com.gameexchange.javabackend.model.MRegisterResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    MRegisterResponse toRegisterResponse(User user);
}
