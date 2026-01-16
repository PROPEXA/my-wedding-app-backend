package org.wedding.app.mapper;

import org.wedding.app.dto.UserDto;
import org.wedding.app.model.TblUser;

public final class UserMapper {

    public static UserDto toDto(TblUser tblUser) {
        return UserDto.builder()
                .id(tblUser.getId())
                .firstName(tblUser.getUsrFirstname())
                .lastName(tblUser.getUsrLastname())
                .birthdate(tblUser.getUsrBirthdate())
                .registeredDate(tblUser.getUsrRegister())
                .modifiedDate(tblUser.getUsrModified())
                .build();
    }

    public static TblUser toEntity(UserDto userDto) {
        return TblUser.builder()
                .usrFirstname(userDto.getFirstName())
                .usrLastname(userDto.getLastName())
                .usrBirthdate(userDto.getBirthdate())
                .build();
    }

}
