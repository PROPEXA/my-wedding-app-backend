package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@DynamicUpdate
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_refresh_token")
@EntityListeners(AuditingEntityListener.class)
public class TblRefreshToken {

    @Id
    @Size(max = 36)
    @Column(name = "tk_id", nullable = false, length = 36)
    private String tkId;

    @NotNull
    @Column(name = "tk_token", nullable = false, length = Integer.MAX_VALUE)
    private String tkToken;

    @Size(max = 12)
    @NotNull
    @Column(name = "tk_type", nullable = false, length = 12)
    private String tkType;

    @Size(max = 1)
    @ColumnDefault("'N'")
    @Column(name = "tk_revoked", length = 1)
    private String tkRevoked;

    @Size(max = 1)
    @ColumnDefault("'N'")
    @Column(name = "tk_expired", length = 1)
    private String tkExpired;

    @Column(name = "tk_account")
    private Integer tkAccount;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "tk_register")
    private Instant tkRegister;

}