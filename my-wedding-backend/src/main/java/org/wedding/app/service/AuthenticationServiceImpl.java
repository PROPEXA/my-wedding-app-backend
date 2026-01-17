package org.wedding.app.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.AuthenticationResponse;
import org.wedding.app.dto.UsernamePassword;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.model.TblAccount;
import org.wedding.app.model.TblRefreshToken;
import org.wedding.app.repository.TblAccountRepository;
import org.wedding.app.repository.TblRefreshTokenRepository;
import org.wedding.app.security.JwtService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final TblRefreshTokenRepository tblRefreshTokenRepository;
    private final TblAccountRepository tblAccountRepository;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthenticationResponse authenticate(UsernamePassword usernamePassword) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(usernamePassword.username(), usernamePassword.password())
        );
        TblAccount tblAccount = auth.getPrincipal() instanceof TblAccount ? (TblAccount) auth.getPrincipal() : null;
        final String accessToken = jwtService.generateToken(tblAccount);
        final String refreshToken = jwtService.generateRefreshToken(tblAccount);

        revokeAllUserTokens(tblAccount);
        saveUserToken(refreshToken, tblAccount.getId());

        return new AuthenticationResponse(accessToken, refreshToken, JwtService.TOKEN_PREFIX, LocalDateTime.now());
    }

    @Override
    public AuthenticationResponse refreshToken(HttpServletRequest request) {

        final String authHeader = request.getHeader("Authorization");
        final String refreshToken;
        final String email;

        if (authHeader == null || !authHeader.startsWith(JwtService.TOKEN_PREFIX + " ")) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Refresh token no encontrado, proporcionalo");
        }
        refreshToken = authHeader.substring(7);
        email = jwtService.extractUsername(refreshToken);

        if (email == null) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Refresh token invalido");
        }

        boolean isTokenValid = tblRefreshTokenRepository.findByTkToken(refreshToken)
                .map(t -> t.getTkExpired().equalsIgnoreCase("N")
                        && t.getTkRevoked().equalsIgnoreCase("N"))
                .orElse(false);

        if (jwtService.isTokenValid(refreshToken) && isTokenValid) {
            TblAccount tblAccount = tblAccountRepository.findByAccEmailIgnoreCase(email)
                    .orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "No se pudo validar la identidad del usuario"));
            final String accessToken = jwtService.generateToken(tblAccount);
            return new AuthenticationResponse(accessToken, refreshToken, JwtService.TOKEN_PREFIX, LocalDateTime.now());
        } else {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Sesión expirada, vuelve a identificarte");
        }
    }

    private void revokeAllUserTokens(TblAccount tblAccount) {
        List<TblRefreshToken> refreshTokens = tblRefreshTokenRepository.findByTkAccount(tblAccount.getId());
        if (refreshTokens.isEmpty()) return;

        refreshTokens.forEach(rt -> {
            rt.setTkRevoked("Y");
            rt.setTkExpired("Y");
        });
        tblRefreshTokenRepository.saveAll(refreshTokens);
    }

    private void saveUserToken(String token, Integer accountId) {
        TblRefreshToken refresh = TblRefreshToken.builder()
                .tkId(UUID.randomUUID().toString())
                .tkToken(token)
                .tkType(JwtService.TOKEN_PREFIX)
                .tkAccount(accountId)
                .build();
    }
}
