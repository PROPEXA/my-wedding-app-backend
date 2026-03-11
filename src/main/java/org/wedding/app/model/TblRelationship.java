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
@Table(name = "tbl_relationships")
public class TblRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_relationships_id_gen")
    @SequenceGenerator(name = "tbl_relationships_id_gen", sequenceName = "seq_relationships", allocationSize = 1)
    @Column(name = "rel_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "rel_name", nullable = false, length = 50)
    private String relName;

    @Size(max = 100)
    @Column(name = "rel_description", length = 100)
    private String relDescription;

    @Size(max = 1)
    @NotNull
    @Column(name = "rel_gender", nullable = false, length = 1)
    private String relGender;

    @Size(max = 1)
    @NotNull
    @Column(name = "rel_status", nullable = false, length = 1)
    private String relStatus;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "rel_created")
    private Instant relCreated;

    @Column(name = "rel_updated")
    private Instant relUpdated;
}