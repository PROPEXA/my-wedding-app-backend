package org.wedding.app.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.wedding.app.group.GrpPost;
import org.wedding.app.model.AccountRole;
import org.wedding.app.model.TblAccount;

public record AccountDto(

        Integer id,

        @NotNull(message = "Role de usuario es requerido", groups = GrpPost.class)
        AccountRole role,

        @NotNull(message = "Nombre de usuario es requerido", groups = GrpPost.class)
        @NotBlank(message = "Nombre de usuario no puede estar en blanco", groups = GrpPost.class)
        String username,

        @NotNull(message = "La contraseña es requerida", groups = GrpPost.class)
        @NotBlank(message = "La contraseña no puede estar en blanco", groups = GrpPost.class)
        @Min(value = 8, message = "La contraseña debe tener al menos 8 caracteres", groups = GrpPost.class)
        String password

) {
    public AccountDto(TblAccount tblAccount) {
        this(tblAccount.getId(), tblAccount.getRole(), tblAccount.getUsername(), null);
    }
}
