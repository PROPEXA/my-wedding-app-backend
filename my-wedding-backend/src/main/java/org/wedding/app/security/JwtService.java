package org.wedding.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.wedding.app.model.TblAccount;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.token.expiration}")
    private Long tokenExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private Long refreshTokenExpiration;

    // 1.0 GENERATE TOKEN
    public String generateToken(TblAccount userDetails) {
        return buildToken(null, userDetails, tokenExpiration);
    }

    // 1.1 GENERATE REFRESH TOKEN
    public String generateRefreshToken(TblAccount userDetails) {
        return buildToken(null, userDetails, refreshTokenExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims,
                              TblAccount account,
                              long expiration) {
        return Jwts.builder()
                .setSubject(account.getAccEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 10 horas
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. VALIDATE TOKEN
    public boolean isTokenValid(String token, TblAccount userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getAccEmail()) && !isTokenExpired(token));
    }

    // 3. EXTRACT USERNAME (CLAIMS)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
