package org.wedding.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tbl_guests")
public class TblGuest {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @ManyToOne
    @JoinColumn(name = "invitation_id", nullable = false)
    private TblInvitation invitation;
}
