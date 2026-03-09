package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * Representa la entidad que define los tipos de eventos en la base de datos,
 * almacenada en la tabla "tbl_events_type".
 * Esta clase está diseñada para ser utilizada con JPA (Java Persistence API)
 * y contiene información del tipo de evento, incluyendo su nombre,
 * fecha de registro y fecha de última modificación.
 */
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
    private LocalDateTime evtRegister;

    @Column(name = "evt_modified")
    private LocalDateTime evtModified;


}