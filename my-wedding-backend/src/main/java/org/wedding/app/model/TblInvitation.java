package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.wedding.app.dto.InvitationGuestDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_invitations")
@EntityListeners(AuditingEntityListener.class)
public class TblInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_invitations_id_gen")
    @SequenceGenerator(name = "tbl_invitations_id_gen", sequenceName = "seq_tbl_invitations", allocationSize = 1)
    @Column(name = "inv_id", nullable = false)
    private Integer id;

    @Size(max = 150)
    @Column(name = "inv_title", length = 150)
    private String invTitle;

    @Column(name = "inv_quantity", precision = 2)
    private BigDecimal invQuantity;

    @NotNull
    @Column(name = "inv_relation", nullable = false)
    private Integer invRelation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inv_relation", insertable = false, updatable = false)
    private TblRelation relation;

    @Size(max = 10)
    @Column(name = "inv_tablenum", length = 10)
    private String invTablenum;

    @NotNull
    @Column(name = "inv_maxconf", nullable = false)
    private OffsetDateTime invMaxconf;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "inv_register")
    private LocalDateTime invRegister;

    @LastModifiedDate
    @Column(name = "inv_modified")
    private LocalDateTime invModified;

    @CreatedBy
    @Column(name = "inv_created_by")
    private Integer invCreatedBy;

    @LastModifiedBy
    @Column(name = "inv_modified_by")
    private Integer invModifiedBy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "inv_guest_list")
    private List<InvitationGuestDto> guests;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tbl_events_invitations",
            joinColumns = @JoinColumn(name = "evi_invitation"),
            inverseJoinColumns = @JoinColumn(name = "evi_event")
    )
    private List<TblEvent> events;

    @Column(name = "inv_uuid")
    private String invUuid;
}