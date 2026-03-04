package org.wedding.app.service;

import org.springframework.data.domain.Pageable;
import org.wedding.app.dto.ConfirmationDto;
import org.wedding.app.dto.InvitationDto;
import java.util.List;

public interface WeddingInvitationService {

    Integer saveInvitation(InvitationDto invitation);

    void updateInvitation(InvitationDto invitation);

    void deleteInvitation(Integer id);

    InvitationDto obtainInvitationById(Integer id);

    List<InvitationDto> obtainAllInvitationsByEventId(Integer eventId, Pageable pageable);

    InvitationDto obtainInvitationByIdAndUuid(int id, String uuid);

    void confirmInvitation(ConfirmationDto confirmation);
}
