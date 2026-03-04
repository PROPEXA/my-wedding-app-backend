package org.wedding.app.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblEventInvitation;
import org.wedding.app.model.TblEventInvitationId;
import org.wedding.app.model.TblInvitation;

import java.util.List;
import java.util.Optional;

@Repository
public interface TblEventInvitationRepository extends JpaRepository<TblEventInvitation, TblEventInvitationId> {

    @Query("SELECT i.eviInvitation FROM TblEventInvitation i WHERE i.id.eviEvent = :eventId AND i.eviCreatedBy = :createdBy")
    List<TblInvitation> findByEventIdAndCreatedBy(Integer eventId, Integer createdBy, Pageable pageable);

    @Query("SELECT i FROM TblEventInvitation i WHERE i.id.eviInvitation = :invitationId AND i.eviCreatedBy = :createdBy")
    List<TblEventInvitation> findByInvitationIdAndCreatedBy(Integer invitationId, Integer createdBy);

    Optional<TblEventInvitation> findById_EviEventAndId_EviInvitationAndEviInvitation_InvUuid(Integer eventId, Integer invitationId, String uuid);

}
