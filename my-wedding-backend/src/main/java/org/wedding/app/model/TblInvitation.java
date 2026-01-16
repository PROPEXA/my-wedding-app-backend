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
@Table(name = "tbl_invitations")
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

    @Size(max = 10)
    @Column(name = "inv_tablenum", length = 10)
    private String invTablenum;

    @NotNull
    @Column(name = "inv_maxconf", nullable = false)
    private OffsetDateTime invMaxconf;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "inv_register")
    private Instant invRegister;

    @Column(name = "inv_modified")
    private Instant invModified;


}