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
import java.util.Random;
import java.util.UUID;
import java.util.function.Function;

@Service
public class OneAccessTokenService {

    @Value("${spring.security.jwt.temporaryToken.secretKey}")
    private String secretKey;

    @Value("${spring.security.jwt.temporaryToken.expiration}")
    private Long expiration;

    private static final Random RANDOM = new Random();

    public static final String OAT_TOKEN = "oat_token";
    public static final String OAT_ID = "oat_id";
    public static final String OAT_NUMBER = "oat_number";

    public Map<String, Object> generate(TblAccount tblAccount) {
        String id = UUID.randomUUID().toString();
        String token = Jwts.builder()
                .setSubject(tblAccount.getAccEmail())
                .setId(id)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        return Map.of(
                OAT_TOKEN, token,
                OAT_ID, id,
                OAT_NUMBER, getRandomNumber());
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Integer getRandomNumber() {
        return RANDOM.nextInt(90000) + 10000;
    }

    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractId(String token) {
        return extractClaim(token, Claims::getId);
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
}
