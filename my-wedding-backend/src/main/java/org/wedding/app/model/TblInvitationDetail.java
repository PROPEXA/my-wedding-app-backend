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
@Table(name = "tbl_invitations_detail")
public class TblInvitationDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_invitations_detail_id_gen")
    @SequenceGenerator(name = "tbl_invitations_detail_id_gen", sequenceName = "seq_tbl_invitations_detail", allocationSize = 1)
    @Column(name = "ind_id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "ind_fullname", nullable = false, length = 100)
    private String indFullname;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ind_invitation", nullable = false)
    private TblInvitation indInvitation;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "ind_register")
    private Instant indRegister;

    @Column(name = "ind_modified")
    private Instant indModified;

    @Size(max = 1)
    @ColumnDefault("'A'")
    @Column(name = "ind_status", length = 1)
    private String indStatus;


}