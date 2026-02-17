package org.wedding.app.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;
import org.wedding.app.security.AuthUtil;
import org.wedding.app.security.JwtService;

import java.util.Optional;

import static org.wedding.app.audit.AuditAware.AUDIT_AWARE;

/**
 * Clase que implementa la interfaz {@link AuditorAware}, proporcionando la funcionalidad de auditoría
 * basada en la identificación del usuario actual autenticado.
 * <p>
 * Esta clase está anotada como un componente Spring para su gestión por el contenedor de Spring
 * bajo el nombre especificado en {@code AUDIT_AWARE}.
 * <p>
 * La funcionalidad principal de esta clase es extraer la identificación del usuario autenticado
 * desde el contexto de seguridad de Spring y devolverlo como auditor actual.
 */
@Component(AUDIT_AWARE)
@RequiredArgsConstructor
public class AuditAware implements AuditorAware<Integer> {

    public static final String AUDIT_AWARE = "audit_aware_impl";

    @Override
    public Optional<Integer> getCurrentAuditor() {
        return AuthUtil.getCurrentUserId();
    }

}
