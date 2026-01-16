package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "tbl_events_type")
public class TblEventType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_events_type_id_gen")
    @SequenceGenerator(name = "tbl_events_type_id_gen", sequenceName = "seq_tbl_events_type", allocationSize = 1)
    @Column(name = "evt_id", nullable = false)
    private Integer id;

    @Size(max = 30)
    @Column(name = "evt_name", length = 30)
    private String evtName;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "evt_register")
    private Instant evtRegister;

    @Column(name = "evt_modified")
    private Instant evtModified;


}