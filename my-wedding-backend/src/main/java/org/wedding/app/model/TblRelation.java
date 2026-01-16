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
@Table(name = "tbl_relations")
public class TblRelation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_relations_id_gen")
    @SequenceGenerator(name = "tbl_relations_id_gen", sequenceName = "seq_tbl_relations", allocationSize = 1)
    @Column(name = "rl_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "rl_name", nullable = false, length = 50)
    private String rlName;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "rl_register")
    private Instant rlRegister;

    @Column(name = "rl_modified")
    private Instant rlModified;


}