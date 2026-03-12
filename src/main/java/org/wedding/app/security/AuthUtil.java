package org.wedding.app.security;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.wedding.app.exception.ServiceException;

import java.util.Optional;

public final class AuthUtil {

    public static Optional<Integer> getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUser customUser) {
            return Optional.of(customUser.getUserId());
        }
        return Optional.empty();
    }

    public static Integer getCurrentUserIdOrThrow() {
        return getCurrentUserId().orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "No se pudo verificar la identidad del usuario"));
    }
}
