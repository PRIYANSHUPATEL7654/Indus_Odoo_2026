package com.wexon.software.wexon_api.modules.audit;

import com.wexon.software.wexon_api.modules.auth.data.UserPrinciple;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
@SuppressWarnings("NullableProblems")
public class AuditorProvider implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.of("system");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrinciple user) {
            return Optional.of(user.getId());
        }

        return Optional.of("system");

    }

}
