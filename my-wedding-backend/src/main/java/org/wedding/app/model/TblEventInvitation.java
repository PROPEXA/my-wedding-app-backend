package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;
import java.time.LocalDateTime;
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

    @LastModifiedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "evi_mod_utc")
    private LocalDateTime eviModUtc;

    @LastModifiedDate
    @Column(name = "evi_mod_tz")
    private LocalDateTime eviModTz;

    @CreatedBy
    @Column(name = "evi_created_by")
    private Integer eviCreatedBy;

    @LastModifiedBy
    @Column(name = "evi_modified_by")
    private Integer eviModifiedBy;

}