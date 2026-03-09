package org.wedding.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_weddings_statistics")
public class TblWeddingStatistic {

    @Column(name = "sta_wedding_id")
    private Integer weddingId;

    @Id
    @Column(name = "sta_events_id")
    private Integer eventId;

    @Column(name = "sta_invitations")
    private Integer invitations;

    @Column(name = "sta_inv_confirm")
    private Integer confirmed;

    @Column(name = "sta_inv_decline")
    private Integer declined;

    @Column(name = "sta_inv_wait")
    private Integer waiting;

    @Column(name = "sta_people_c")
    private Integer peopleConfirmed;

    @Column(name = "sta_people_d")
    private Integer peopleDeclined;

    @Column(name = "sta_people_w")
    private Integer peopleWaiting;

    @Column(name = "sta_timestamp")
    private LocalDateTime updatedAt;
}