package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.Instant;

/**
 * Representa la entidad de cuenta que se almacena en la tabla "tbl_accounts".
 * Esta clase está diseñada para ser utilizada con JPA (Java Persistence API) y contiene información
 * relacionada con la gestión de cuentas de usuario, incluyendo email, estado, registro y actualización.
 */
@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_accounts")
@EntityListeners(AuditingEntityListener.class)
public class TblAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_accounts_id_gen")
    @SequenceGenerator(name = "tbl_accounts_id_gen", sequenceName = "seq_tbl_accounts", allocationSize = 1)
    @Column(name = "acc_id", nullable = false)
    private Integer id;

    @Size(max = 40)
    @NotNull
    @Column(name = "acc_email", nullable = false, length = 40)
    private String accEmail;

    @Size(max = 1)
    @NotNull
    @Column(name = "acc_emailconf", nullable = false, length = 1)
    private String accEmailconf;

    @Size(max = 100)
    @NotNull
    @Column(name = "acc_password", nullable = false, length = 100)
    private String accPassword;

    @Size(max = 1)
    @ColumnDefault("'A'")
    @Column(name = "acc_status", length = 1)
    private String accStatus;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "acc_register")
    private Instant accRegister;

    @LastModifiedDate
    @Column(name = "acc_updated")
    private Instant accUpdated;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "acc_user", nullable = false)
    private TblUser accUser;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "acc_lang", nullable = false)
    private TblLanguage accLang;

}