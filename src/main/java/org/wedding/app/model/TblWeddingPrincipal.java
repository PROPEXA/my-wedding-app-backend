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
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "tbl_wedding_principals")
public class TblWeddingPrincipal {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_wedding_principals_id_gen")
    @SequenceGenerator(name = "tbl_wedding_principals_id_gen", sequenceName = "seq_wedding_principals", allocationSize = 1)
    @Column(name = "wp_id", nullable = false)
    private Integer id;

    @Size(max = 1)
    @NotNull
    @Column(name = "wp_type", nullable = false, length = 1)
    private String wpType;

    @Size(max = 50)
    @NotNull
    @Column(name = "wp_fn", nullable = false, length = 50)
    private String wpFn;

    @Size(max = 50)
    @NotNull
    @Column(name = "wp_ln", nullable = false, length = 50)
    private String wpLn;

    @Column(name = "wp_br")
    private LocalDate wpBr;

    @Size(max = 40)
    @Column(name = "wp_email", length = 40)
    private String wpEmail;

    @Size(max = 20)
    @Column(name = "wp_phone", length = 20)
    private String wpPhone;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "wp_registered")
    private Instant wpRegistered;

    @LastModifiedDate
    @Column(name = "wp_updated")
    private Instant wpUpdated;

    @Size(max = 1)
    @NotNull
    @Column(name = "wp_status", nullable = false, length = 1)
    private String wpStatus;

//    @NotNull
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "wp_wedding", insertable = false, updatable = false)
//    private TblWedding wpWeddingObj;

    @Column(name = "wp_wedding", nullable = false)
    private Integer wpWedding;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wp_relation", insertable = false, updatable = false)
    private TblRelationship wpRelationObj;

    @Column(name = "wp_relation")
    private Integer wpRelation;

    @PrePersist
    public void prePersist() {
        this.wpStatus = this.wpStatus == null ? "A" : this.wpStatus;
    }
}