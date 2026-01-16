package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tbl_schedules")
public class TblSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_schedules_id_gen")
    @SequenceGenerator(name = "tbl_schedules_id_gen", sequenceName = "seq_tbl_schedules", allocationSize = 1)
    @Column(name = "sch_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sch_event", nullable = false)
    private TblEvent schEvent;

    @Size(max = 100)
    @NotNull
    @Column(name = "sch_title", nullable = false, length = 100)
    private String schTitle;

    @Column(name = "sch_description", length = Integer.MAX_VALUE)
    private String schDescription;

    @Column(name = "sch_start_time")
    private Instant schStartTime;

    @Column(name = "sch_end_time")
    private Instant schEndTime;

    @Column(name = "sch_created_at")
    private Instant schCreatedAt;

    @Size(max = 1)
    @ColumnDefault("'A'")
    @Column(name = "sch_status", length = 1)
    private String schStatus;
}