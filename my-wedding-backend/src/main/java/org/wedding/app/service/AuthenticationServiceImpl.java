package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.AuthenticationResponse;
import org.wedding.app.dto.UsernamePassword;
import org.wedding.app.model.TblAccount;
import org.wedding.app.model.TblRefreshToken;
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
