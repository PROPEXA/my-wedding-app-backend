package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "tbl_events")
public class TblEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_events_id_gen")
    @SequenceGenerator(name = "tbl_events_id_gen", sequenceName = "seq_tbl_events", allocationSize = 1)
    @Column(name = "eve_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "eve_date_ini", nullable = false)
    private OffsetDateTime eveDateIni;

    @Column(name = "eve_date_fin")
    private OffsetDateTime eveDateFin;

    @Size(max = 100)
    @NotNull
    @Column(name = "eve_title", nullable = false, length = 100)
    private String eveTitle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eve_type")
    private TblEventType eveType;

    @Size(max = 200)
    @NotNull
    @Column(name = "eve_address", nullable = false, length = 200)
    private String eveAddress;

    @Column(name = "eve_loc_lat", precision = 11, scale = 8)
    private BigDecimal eveLocLat;

    @Column(name = "eve_loc_lng", precision = 11, scale = 8)
    private BigDecimal eveLocLng;

    @Column(name = "eve_sequence", precision = 2)
    private BigDecimal eveSequence;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "eve_wedding", nullable = false)
    private TblWedding eveWedding;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "eve_register")
    private Instant eveRegister;

    @Column(name = "eve_modified")
    private Instant eveModified;

    @Size(max = 1)
    @ColumnDefault("'A'")
    @Column(name = "eve_status", length = 1)
    private String eveStatus;


}