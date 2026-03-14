package com.wexon.software.wexon_api.modules.auth.services;

import com.wexon.software.wexon_api.modules.auth.data.UserPrinciple;
import com.wexon.software.wexon_api.modules.users.dtos.UserDTOForUserPrinciple;
import com.wexon.software.wexon_api.modules.users.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPrincipleService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserDTOForUserPrinciple user = userService.getUserByEmailForUserPrinciple(username);

        UserPrinciple userPrinciple = new UserPrinciple();
        userPrinciple.setId(user.getId());
        userPrinciple.setUserName(user.getEmail());
        userPrinciple.setPassword(user.getPassword());
        userPrinciple.setFullName(user.getFullName());
        userPrinciple.setMobileNumber(user.getMobileNumber());
        userPrinciple.setRoles(user.getRoles());
        userPrinciple.setEnabled(user.getEnabled());
        userPrinciple.setAccountNonExpired(user.getAccountNonExpired());
        userPrinciple.setCredentialsNonExpired(user.getCredentialsNonExpired());
        userPrinciple.setAccountNonLocked(user.getAccountNonLocked());

        return userPrinciple;

    }

}
