package org.wedding.app.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tbl_weddings")
public class TblWedding {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "groom_name", nullable = false)
    private String groomName;

    @Column(name = "bride_name", nullable = false)
    private String brideName;

}
