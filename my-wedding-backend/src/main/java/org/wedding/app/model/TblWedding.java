package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "tbl_weddings")
public class TblWedding {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_weddings_id_gen")
    @SequenceGenerator(name = "tbl_weddings_id_gen", sequenceName = "seq_tbl_wedding", allocationSize = 1)
    @Column(name = "wed_id", nullable = false)
    private Integer id;

    @CreatedBy
    @Column(name = "wed_account", nullable = false)
    private Integer wedAccount;

    @Size(max = 50)
    @NotNull
    @Column(name = "wed_bride_fn", nullable = false, length = 50)
    private String wedBrideFn;

    @Size(max = 50)
    @NotNull
    @Column(name = "wed_bride_ln", nullable = false, length = 50)
    private String wedBrideLn;

    @Column(name = "wed_bride_br")
    private LocalDate wedBrideBr;

    @Size(max = 40)
    @Column(name = "wed_bride_ema", length = 40)
    private String wedBrideEma;

    @Size(max = 20)
    @Column(name = "wed_bride_tel", length = 20)
    private String wedBrideTel;

    @Size(max = 50)
    @NotNull
    @Column(name = "wed_groom_fn", nullable = false, length = 50)
    private String wedGroomFn;

    @Size(max = 50)
    @NotNull
    @Column(name = "wed_groom_ln", nullable = false, length = 50)
    private String wedGroomLn;

    @Column(name = "wed_groom_br")
    private LocalDate wedGroomBr;

    @Size(max = 40)
    @Column(name = "wed_groom_ema", length = 40)
    private String wedGroomEma;

    @Size(max = 20)
    @Column(name = "wed_groom_tel", length = 20)
    private String wedGroomTel;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "wed_register")
    private LocalDateTime wedRegister;

    @LastModifiedDate
    @Column(name = "wed_updated")
    private LocalDateTime wedUpdated;

    @Size(max = 1)
    @ColumnDefault("'A'")
    @Column(name = "wed_status", length = 1)
    private String wedStatus;
}