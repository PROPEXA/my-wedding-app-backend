package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_events_invitations")
@EntityListeners(AuditingEntityListener.class)
public class TblEventInvitation {
    @EmbeddedId
    @SequenceGenerator(name = "tbl_events_invitations_id_gen", sequenceName = "seq_tbl_events", allocationSize = 1)
    private TblEventInvitationId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evi_event", insertable = false, updatable = false)
    private TblEvent eviEvent;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evi_invitation", insertable = false, updatable = false)
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