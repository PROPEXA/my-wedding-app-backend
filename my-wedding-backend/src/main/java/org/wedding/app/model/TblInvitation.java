package org.wedding.app.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_invitations")
public class TblInvitation {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InvitationStatus status;

    @Column(name = "confirmation_date", nullable = false)
    private LocalDate confirmationDate;

    @Column(name = "number_of_guests", nullable = false)
    private Short numberOfGuests;

    @Column(name = "uuid", nullable = false)
    private String uuid;

    @ManyToOne
    @JoinColumn(name = "wedding_id", nullable = false)
    private TblWedding wedding;
}
