package org.wedding.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "tbl_invitation_settings")
public class TblInvitationSetting {
    @Id
    @Column(name = "is_wedding", nullable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "is_wedding", insertable = false, updatable = false)
    private TblWedding tblWedding;

    @Column(name = "is_phrase", length = 400)
    private String isPhrase;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "is_register")
    private Instant isRegister;

    @Column(name = "is_updated")
    private Instant isUpdated;
}