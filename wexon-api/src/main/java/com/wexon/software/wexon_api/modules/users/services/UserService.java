package com.wexon.software.wexon_api.modules.users.services;

import com.wexon.software.wexon_api.modules.auth.dtos.LoginResponseDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserDTOForUserPrinciple;
import com.wexon.software.wexon_api.modules.users.dtos.UserCreateRequestDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserUpdateRequestDTO;
import com.wexon.software.wexon_api.modules.users.models.UserModel;

import java.util.List;

public interface UserService {
    UserDTOForUserPrinciple getUserByEmailForUserPrinciple(String email);
    LoginResponseDTO getCurrentUser();
    UserDTO createUser(UserCreateRequestDTO dto);
    UserDTO updateUser(String id, UserUpdateRequestDTO dto);
    String deleteUser(String id);
    UserDTO getUser(String id);
    List<UserDTO> getUserList();
}
