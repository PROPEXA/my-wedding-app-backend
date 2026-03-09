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

    public static final String TOKEN_PREFIX = "Bearer";
    private static final String TOKEN_TYPE = "token_type";

    public static final String ACCESS_TOKEN = "access_token";
    public static final String REFRESH_TOKEN = "refresh_token";
    public static final String ACCOUNT_ID = "account_id";

    /**
     * Representa la clave secreta utilizada para la configuración de JWT
     * en el sistema de seguridad de Spring.
     * <p>
     * Esta clave es utilizada para firmar y verificar los tokens JWT,
     * garantizando la integridad y autenticidad de los mismos.
     * <p>
     * Se extrae automáticamente del archivo de configuración de la
     * aplicación mediante la anotación @Value.
     */
    @Value("${spring.security.jwt.secretKey}")
    private String secretKey;

    /**
     * Representa la duración de validez del token de acceso (access token) en milisegundos.
     * <p>
     * Esta variable se utiliza para determinar el tiempo que un token generado
     * es válido antes de que expire y deje de ser aceptado por el sistema.
     * <p>
     * La configuración de este valor se obtiene desde una propiedad externa
     * definida en el archivo de configuración, utilizando la clave
     * `spring.security.jwt.token.expiration`.
     */
    @Value("${spring.security.jwt.token.expiration}")
    private Long tokenExpiration;

    /**
     * Configuración del tiempo de expiración del token de refresco (refresh token).
     * <p>
     * Esta variable determina la duración en milisegundos durante la cual un token de refresco
     * es considerado válido después de su emisión. Una vez que este tiempo expira, el token de
     * refresco ya no será válido y no podrá ser utilizado para obtener un nuevo token de acceso.
     * <p>
     * La configuración se realiza a través de una propiedad externa definida en
     * `application.properties` o `application.yml`, utilizando la clave
     * `spring.security.jwt.refreshToken.expiration`.
     */
    @Value("${spring.security.jwt.refreshToken.expiration}")
    private Long refreshTokenExpiration;

    /**
     * Genera un token de acceso (access token) utilizando los datos de la cuenta
     * proporcionada y un tiempo de expiración específico.
     *
     * @param userDetails La cuenta de usuario (TblAccount) que contiene la información
     *                    necesaria para generar el token.
     * @return Una cadena de texto que representa el token de acceso (access token) generado.
     */
    public String generateToken(TblAccount userDetails) {
        return buildToken(Map.of(
                TOKEN_TYPE, ACCESS_TOKEN,
                ACCOUNT_ID, userDetails.getId()
        ), userDetails, tokenExpiration);
    }

    /**
     * Genera un token de refresco (refresh token) utilizando la información de la cuenta
     * proporcionada y un tiempo de expiración específico.
     *
     * @param userDetails La cuenta de usuario (TblAccount) de la cual se extraerán los datos necesarios
     *                    para generar el token.
     * @return Una cadena de texto que representa el token de refresco (refresh token) generado.
     */
    public String generateRefreshToken(TblAccount userDetails) {
        return buildToken(Map.of(
                        TOKEN_TYPE, REFRESH_TOKEN,
                        ACCOUNT_ID, userDetails.getId()),
                userDetails, refreshTokenExpiration);
    }

    /**
     * Construye un token JWT utilizando el mapa de claims adicionales, la información
     * de la cuenta proporcionada y un tiempo de expiración específico.
     *
     * @param extraClaims Un mapa que contiene los claims adicionales a incluir en el token.
     * @param account     La cuenta de usuario cuyo email será establecido como el sujeto del token.
     * @param expiration  La duración en milisegundos que define el tiempo de expiración del token.
     * @return Un string que representa el token JWT generado.
     */
    private String buildToken(Map<String, Object> extraClaims,
                              TblAccount account,
                              long expiration) {
        return Jwts.builder()
                .setSubject(account.getAccEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 10 horas
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .addClaims(extraClaims)
                .compact();
    }

    /**
     * Determina si un token JWT es válido verificando que no haya expirado.
     *
     * @param token El token JWT que se desea validar.
     * @return {@code true} si el token es válido (no ha expirado); {@code false} en caso contrario.
     */
    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    /**
     * Extrae el nombre de usuario (subject) de un token JWT.
     *
     * @param token El token JWT del cual se desea extraer el nombre de usuario.
     * @return Una cadena que representa el nombre de usuario contenido en el token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae el tipo de token (token_type) contenido en un token JWT.
     *
     * @param token El token JWT del cual se desea extraer el tipo de token.
     * @return Una cadena que representa el tipo de token extraído (por ejemplo, "access_token" o "refresh_token").
     */
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get(TOKEN_TYPE, String.class));
    }

    /**
     * Extrae un claim específico de un token JWT utilizando una función de resolución proporcionada.
     *
     * @param <T>            El tipo del valor del claim que se desea extraer.
     * @param token          El token JWT del cual se desea extraer un claim.
     * @param claimsResolver Una función que procesa los claims del token y retorna el valor deseado.
     * @return El valor del claim extraído del token JWT.
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae y devuelve todos los claims contenidos en un token JWT.
     *
     * @param token El token JWT del cual se desea extraer los claims.
     * @return Un objeto {@code Claims} que contiene toda la información extraída del token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Genera y devuelve la clave de firma utilizada para firmar y verificar tokens JWT.
     * La clave se deriva de una cadena codificada en Base64, que se decodifica
     * y se convierte en una clave HMAC-SHA para asegurar el token.
     *
     * @return La clave criptográfica HMAC-SHA utilizada para firmar tokens JWT.
     */
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Verifica si un token JWT ha expirado comparando su fecha de expiración con la fecha actual.
     *
     * @param token El token JWT que se desea verificar.
     * @return {@code true} si el token ha expirado; {@code false} en caso contrario.
     */
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    /**
     * Extrae el identificador de cuenta (accountId) contenido en el token JWT.
     *
     * @param token El token JWT del cual se desea extraer el identificador de cuenta.
     * @return El identificador de cuenta (accountId) extraído del token.
     */
    public int extractAccountId(String token) {
        return extractClaim(token, claims -> claims.get(ACCOUNT_ID, Integer.class));
    }
}
