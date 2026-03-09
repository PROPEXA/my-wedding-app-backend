package org.wedding.app.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUser extends User {

    @Getter
    private final int userId;

    /**
     * Constructor para inicializar un objeto de tipo CustomUser.
     *
     * @param accountId   Identificador único de la cuenta asociada al usuario.
     * @param username    Nombre de usuario utilizado para la autenticación.
     * @param password    Contraseña del usuario en formato encriptado.
     * @param authorities Colección de permisos o roles asociados al usuario.
     */
    public CustomUser(int accountId,
                      String username,
                      String password,
                      Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.userId = accountId;
    }
}
