package org.wedding.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class TblEventInvitationId implements Serializable {
    private static final long serialVersionUID = -4469433702554348529L;
    @NotNull
    @Column(name = "evi_event", nullable = false)
    private Integer eviEvent;

    @NotNull
    @Column(name = "evi_invitation", nullable = false)
    private Integer eviInvitation;


}