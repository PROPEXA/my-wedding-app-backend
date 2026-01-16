package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "tbl_events_invitations")
public class TblEventInvitation {
    @EmbeddedId
    @SequenceGenerator(name = "tbl_events_invitations_id_gen", sequenceName = "seq_tbl_events", allocationSize = 1)
    private TblEventInvitationId id;

    @MapsId("eviEvent")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evi_event", nullable = false)
    private TblEvent eviEvent;

    @MapsId("eviInvitation")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evi_invitation", nullable = false)
    private TblInvitation eviInvitation;

    @Size(max = 1)
    @ColumnDefault("'P'")
    @Column(name = "evi_status", length = 1)
    private String eviStatus;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "evi_mod_utc")
    private Instant eviModUtc;

    @Column(name = "evi_mod_tz")
    private OffsetDateTime eviModTz;


}