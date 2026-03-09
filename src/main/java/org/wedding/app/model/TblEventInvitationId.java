package org.wedding.app.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TblEventInvitationId implements Serializable {

    @NotNull
    @Column(name = "evi_event", nullable = false)
    private Integer eviEvent;

    @NotNull
    @Column(name = "evi_invitation", nullable = false)
    private Integer eviInvitation;

}