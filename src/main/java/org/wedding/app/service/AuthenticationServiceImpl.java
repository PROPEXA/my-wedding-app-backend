package org.wedding.app.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
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
        if (tblAccount == null) throw new ServiceException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        final String accessToken = jwtService.generateToken(tblAccount);
        final String refreshToken = jwtService.generateRefreshToken(tblAccount);

        revokeAllUserTokens(tblAccount);
        saveSessionToken(refreshToken, tblAccount.getId());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            log.warn("Exception sleeping thread: Interrupción de espera de thread");
        }
        return new AuthenticationResponse(accessToken, refreshToken, JwtService.TOKEN_PREFIX, LocalDateTime.now());
    }

    @Override
    public AuthenticationResponse refreshToken(HttpServletRequest request) {

        final String authHeader = request.getHeader("X-Refresh");

        if (authHeader == null || !authHeader.startsWith(JwtService.TOKEN_PREFIX + " ")) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Refresh token no encontrado, proporcionalo");
        }

        String refreshToken = authHeader.substring(7);
        final String tokenType = jwtService.extractTokenType(refreshToken);
        if (!JwtService.REFRESH_TOKEN.equalsIgnoreCase(tokenType)) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED, "Token no es de tipo refresh");
        }

        TblRefreshToken tblRefreshToken = tblRefreshTokenRepository.findByTkToken(refreshToken)
                .orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "Sesión expirada, vuelve a identificarte"));
        boolean isTokenValid = tblRefreshToken.getTkExpired().equalsIgnoreCase("N") && tblRefreshToken.getTkRevoked().equalsIgnoreCase("N");

        if (jwtService.isTokenValid(refreshToken) && isTokenValid) {
            String email = jwtService.extractUsername(refreshToken);
            TblAccount tblAccount = tblAccountRepository.findByAccEmailIgnoreCase(email)
                    .orElseThrow(() -> new ServiceException(HttpStatus.UNAUTHORIZED, "No se pudo validar la identidad del usuario"));
            final String accessToken = jwtService.generateToken(tblAccount);
            return new AuthenticationResponse(accessToken, refreshToken, JwtService.TOKEN_PREFIX, LocalDateTime.now());
        } else {
            if (isTokenValid) {
                tblRefreshToken.setTkRevoked("Y");
                tblRefreshToken.setTkExpired("Y");
                tblRefreshTokenRepository.save(tblRefreshToken);
            }
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

    private void saveSessionToken(String token, Integer accountId) {
        tblRefreshTokenRepository.save(TblRefreshToken.builder()
                .tkId(UUID.randomUUID().toString())
                .tkToken(token)
                .tkType(JwtService.TOKEN_PREFIX)
                .tkRevoked("N")
                .tkExpired("N")
                .tkAccount(accountId)
                .build()
        );
    }
}
