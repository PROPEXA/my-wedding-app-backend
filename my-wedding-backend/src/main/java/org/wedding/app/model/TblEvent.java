package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "tbl_events")
public class TblEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_events_id_gen")
    @SequenceGenerator(name = "tbl_events_id_gen", sequenceName = "seq_tbl_events", allocationSize = 1)
    @Column(name = "eve_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "eve_date_ini", nullable = false)
    private LocalDateTime eveDateIni;

    @Column(name = "eve_date_fin")
    private LocalDateTime eveDateFin;

    @Size(max = 100)
    @NotNull
    @Column(name = "eve_title", nullable = false, length = 100)
    private String eveTitle;

    @Column(name = "eve_type")
    private Integer eveType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eve_type", insertable = false, updatable = false)
    private TblEventType eveTypeObj;

    @Size(max = 200)
    @NotNull
    @Column(name = "eve_address", nullable = false, length = 200)
    private String eveAddress;

    @Column(name = "eve_loc_lat", precision = 11, scale = 8)
    private String eveLocLat;

    @Column(name = "eve_loc_lng", precision = 11, scale = 8)
    private String eveLocLng;

    @Column(name = "eve_sequence", precision = 2)
    private BigDecimal eveSequence;

    @NotNull
    @Column(name = "eve_wedding", nullable = false)
    private Integer eveWedding;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "eve_wedding", nullable = false, insertable = false, updatable = false)
    private TblWedding eveWeddingObj;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "eve_register")
    private LocalDateTime eveRegister;

    @LastModifiedDate
    @Column(name = "eve_modified")
    private LocalDateTime eveModified;

    @Size(max = 1)
    @ColumnDefault("'A'")
    @Column(name = "eve_status", length = 1)
    private String eveStatus;

    @CreatedBy
    @Column(name = "eve_created_by")
    private Integer eveCreatedBy;

    @LastModifiedBy
    @Column(name = "eve_modified_by")
    private Integer eveModifiedBy;
}