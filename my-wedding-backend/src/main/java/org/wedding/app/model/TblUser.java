package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
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
@Table(name = "tbl_users")
@EntityListeners(AuditingEntityListener.class)
public class TblUser {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tbl_users_id_gen")
    @SequenceGenerator(name = "tbl_users_id_gen", sequenceName = "seq_tbl_users", allocationSize = 1)
    @Column(name = "usr_id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "usr_firstname", nullable = false, length = 50)
    private String usrFirstname;

    @Size(max = 50)
    @NotNull
    @Column(name = "usr_lastname", nullable = false, length = 50)
    private String usrLastname;

    @NotNull
    @Column(name = "usr_birthdate", nullable = false)
    private LocalDate usrBirthdate;

    @CreatedDate
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "usr_register")
    private Instant usrRegister;

    @LastModifiedDate
    @Column(name = "usr_modified")
    private Instant usrModified;


}