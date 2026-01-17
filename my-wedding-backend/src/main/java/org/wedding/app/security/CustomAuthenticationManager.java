package org.wedding.app.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.model.TblAccount;
import org.wedding.app.repository.TblAccountRepository;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationManager implements AuthenticationManager {

    private final PasswordEncoder encoder;
    private final TblAccountRepository tblAccountRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        final String username = authentication.getName();
        final String password = authentication.getCredentials().toString();

        TblAccount tblAccount = tblAccountRepository.findByAccEmailIgnoreCase(username)
                .orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if (tblAccount.getAccStatus().equalsIgnoreCase("I")) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "La cuenta esta inactiva, contacte con soporte para su reactivación");
        }

        if (!encoder.matches(password, tblAccount.getAccPassword())) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }
        return new UsernamePasswordAuthenticationToken(
                tblAccount,
                null,
                null
        );
    }
}
