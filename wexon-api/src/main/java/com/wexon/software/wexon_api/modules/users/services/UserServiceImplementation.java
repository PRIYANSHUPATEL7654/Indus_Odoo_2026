package com.wexon.software.wexon_api.modules.users.services;

import com.wexon.software.wexon_api.commons.exceptions.ErrorCode;
import com.wexon.software.wexon_api.commons.exceptions.ExtendedException.BusinessException;
import com.wexon.software.wexon_api.modules.auth.components.JwtProvider;
import com.wexon.software.wexon_api.modules.auth.data.UserPrinciple;
import com.wexon.software.wexon_api.modules.auth.dtos.LoginResponseDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserDTOForUserPrinciple;
import com.wexon.software.wexon_api.modules.users.dtos.UserCreateRequestDTO;
import com.wexon.software.wexon_api.modules.users.dtos.UserUpdateRequestDTO;
import com.wexon.software.wexon_api.modules.users.models.RoleModel;
import com.wexon.software.wexon_api.modules.users.models.UserModel;
import com.wexon.software.wexon_api.modules.users.repositories.RoleRepository;
import com.wexon.software.wexon_api.modules.users.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtProvider jwtProvider;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDTOForUserPrinciple getUserByEmailForUserPrinciple(String email) {
        UserModel user = userRepository.getUserModelByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        List<RoleModel> roleModelList = new ArrayList<>();
        List<String> roleIds = user.getRoleIds();
        for (String roleId : roleIds) {
            Optional<RoleModel> role = roleRepository.findById(roleId);
            role.ifPresent(roleModelList::add);
        }

        UserDTOForUserPrinciple userDTO = new UserDTOForUserPrinciple();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setPassword(user.getPassword());
        userDTO.setFullName(user.getFullName());
        userDTO.setMobileNumber(user.getMobileNumber());
        userDTO.setRoles(roleModelList);
        userDTO.setEnabled(user.getEnabled());
        userDTO.setAccountNonExpired(user.getAccountNonExpired());
        userDTO.setCredentialsNonExpired(user.getCredentialsNonExpired());
        userDTO.setAccountNonLocked(user.getAccountNonLocked());
        return userDTO;
    }

    @Override
    public LoginResponseDTO getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserPrinciple userPrinciple = (UserPrinciple) auth.getPrincipal();

        if (!userPrinciple.getEnabled()) {
            throw new RuntimeException("User is not enabled");
        }
        String token = jwtProvider.generateToken(auth);

        return new LoginResponseDTO(
                userPrinciple.getId(),
                userPrinciple.getUsername(),
                userPrinciple.getFullName(),
                userPrinciple.getMobileNumber(),
                token,
                userPrinciple.getRoles()
        );
    }

    @Override
    public UserDTO createUser(UserCreateRequestDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException(
                    ErrorCode.USER_ALREADY_EXISTS.message(),
                    ErrorCode.USER_ALREADY_EXISTS.code()
            );
        }

        if (userRepository.existsByMobileNumber(dto.getMobileNumber())) {
            throw new BusinessException(
                    ErrorCode.USER_MOBILE_EXISTS.message(),
                    ErrorCode.USER_MOBILE_EXISTS.code()
            );
        }

        List<RoleModel> roles = roleRepository.findAllById(dto.getRoleIds());
        if (roles.size() != dto.getRoleIds().size()) {
            throw new BusinessException(
                    ErrorCode.ROLE_NOT_FOUND.message(),
                    ErrorCode.ROLE_NOT_FOUND.code()
            );
        }

        UserModel user = UserModel.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .mobileNumber(dto.getMobileNumber())
                .roleIds(dto.getRoleIds())
                .enabled(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .accountNonLocked(true)
                .build();

        UserModel saved = userRepository.save(user);
        return toResponse(saved, roles);
    }

    @Override
    public UserDTO updateUser(String id, UserUpdateRequestDTO dto) {
        UserModel existing = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.USER_NOT_FOUND.message(),
                        ErrorCode.USER_NOT_FOUND.code()
                ));

        List<RoleModel> roles = roleRepository.findAllById(dto.getRoleIds());
        if (roles.size() != dto.getRoleIds().size()) {
            throw new BusinessException(
                    ErrorCode.ROLE_NOT_FOUND.message(),
                    ErrorCode.ROLE_NOT_FOUND.code()
            );
        }

        existing.setFullName(dto.getFullName());
        existing.setRoleIds(dto.getRoleIds());

        if (!existing.getEmail().equals(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException(
                    ErrorCode.USER_ALREADY_EXISTS.message(),
                    ErrorCode.USER_ALREADY_EXISTS.code()
            );
        }

        if (!existing.getMobileNumber().equals(dto.getMobileNumber()) &&
                userRepository.existsByMobileNumber(dto.getMobileNumber())) {
            throw new BusinessException(
                    ErrorCode.USER_MOBILE_EXISTS.message(),
                    ErrorCode.USER_MOBILE_EXISTS.code()
            );
        }

        existing.setEmail(dto.getEmail());
        existing.setMobileNumber(dto.getMobileNumber());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        UserModel updated = userRepository.save(existing);
        return toResponse(updated, roles);
    }

    @Override
    public String deleteUser(String id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.USER_NOT_FOUND.message(),
                        ErrorCode.USER_NOT_FOUND.code()
                ));
        userRepository.delete(user);
        return id;
    }

    @Override
    public UserDTO getUser(String id) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.USER_NOT_FOUND.message(),
                        ErrorCode.USER_NOT_FOUND.code()
                ));

        List<RoleModel> roles = roleRepository.findAllById(user.getRoleIds());
        return toResponse(user, roles);
    }

    @Override
    public List<UserDTO> getUserList() {
        return userRepository.findAll().stream()
                .map(user -> toResponse(user,
                        roleRepository.findAllById(user.getRoleIds())))
                .toList();
    }

    private UserDTO toResponse(UserModel user, List<RoleModel> roles) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .roles(roles)
                .build();
    }
}
