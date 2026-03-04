package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.ConfirmationDto;
import org.wedding.app.dto.InvitationDto;
import org.wedding.app.dto.enums.ConfirmationType;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.InvitationMapper;
import org.wedding.app.model.TblEventInvitation;
import org.wedding.app.model.TblEventInvitationId;
import org.wedding.app.model.TblInvitation;
import org.wedding.app.repository.TblEventInvitationRepository;
import org.wedding.app.repository.TblEventRepository;
import org.wedding.app.repository.TblInvitationRepository;
import org.wedding.app.security.AuthUtil;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeddingInvitationServiceImpl implements WeddingInvitationService {

    private final TblInvitationRepository tblInvitationRepository;
    private final TblEventRepository tblEventRepository;
    private final TblEventInvitationRepository tblEventInvitationRepository;

    @Override
    @Transactional
    public Integer saveInvitation(InvitationDto invitation) {
        validateAssociatedEvents(invitation.eventsId());
        final int invitationId = persistInvitation(invitation);
        persistEventsAssociatedWithInvitation(invitationId, invitation.eventsId());
        return invitationId;
    }

    private void validateAssociatedEvents(List<Integer> ids) {
        final int authId = AuthUtil.getCurrentUserId().orElseThrow();
        boolean exists = tblEventRepository.existsByIdInAndEveCreatedBy(ids, authId);
        if (!exists) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "Los eventos asociados a invitación no existen");
        }
    }

    private int persistInvitation(InvitationDto invitation) {
        final TblInvitation temp = InvitationMapper.toEntity(invitation);
        final TblInvitation persisted = tblInvitationRepository.saveAndFlush(temp);
        return persisted.getId();
    }

    private void persistEventsAssociatedWithInvitation(int invitationId, List<Integer> eventsId) {
        List<TblEventInvitation> eventsInvitations = eventsId.stream()
                .map(eventId -> TblEventInvitation.builder()
                        .id(TblEventInvitationId.builder()
                                .eviInvitation(invitationId)
                                .eviEvent(eventId)
                                .build())
                        .eviStatus("P") // Pending Confirmation
                        .build())
                .toList();
        tblEventInvitationRepository.saveAll(eventsInvitations);
    }

    @Override
    public void updateInvitation(InvitationDto invitation) {

    }

    @Override
    @Transactional
    public void deleteInvitation(Integer id) {
        final int authId = AuthUtil.getCurrentUserId().orElseThrow();
        List<TblEventInvitation> listToDelete = tblEventInvitationRepository.findByInvitationIdAndCreatedBy(id, authId);
        if (!listToDelete.isEmpty()) {
            tblEventInvitationRepository.deleteAll(listToDelete);
            tblEventInvitationRepository.flush();
        }
        tblInvitationRepository.deleteById(id);
    }

    @Override
    public InvitationDto obtainInvitationById(Integer id) {
        final int authId = AuthUtil.getCurrentUserId().orElseThrow();
        TblInvitation invitation = tblInvitationRepository.findByIdAndInvCreatedBy(id, authId)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Invitación no encontrada"));
        return InvitationMapper.toDto(invitation, true);
    }

    @Override
    public List<InvitationDto> obtainAllInvitationsByEventId(Integer eventId, Pageable pageable) {
        final int authId = AuthUtil.getCurrentUserId().orElseThrow();

        Pageable newPageable = PageRequest.of(pageable.getPageNumber()
                , pageable.getPageSize(),
                Sort.by("id"
                ).descending()
        );
        List<TblInvitation> invitations = tblEventInvitationRepository.findByEventIdAndCreatedBy(eventId, authId, newPageable);
        if (invitations.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No se encontraron invitaciones para el evento solicitado");
        }
        return invitations.stream().map(i -> InvitationMapper.toDto(i, false)).toList();
    }

    @Override
    public List<InvitationDto> obtainAllInvitationsByWeddingId(Integer weddingId, Pageable pageable) {
        Pageable newPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("id").descending());
        List<TblInvitation> invitations = tblEventInvitationRepository.findByWeddingIdAndPageable(weddingId,newPageable);
        if(invitations.isEmpty()){
            throw new ServiceException(HttpStatus.NOT_FOUND, "No se encontraron invitaciones para la boda solicitada");
        }
        return invitations.stream().map(i -> InvitationMapper.toDto(i, false)).toList();
    }

    @Override
    public InvitationDto obtainInvitationByIdAndUuid(int id, String uuid) {
        final TblInvitation invitation = tblInvitationRepository.findByIdAndInvUuid(id, uuid)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Invitación no encontrada"));
        return InvitationMapper.toDto(invitation, true);
    }

    @Override
    @Transactional
    public void confirmInvitation(ConfirmationDto confirmation) {
        final boolean exists = tblInvitationRepository.existsByIdAndInvUuid(confirmation.invitationId(), confirmation.token());
        if (!exists) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "Invitación no encontrada");
        }
        List<TblEventInvitation> modified = new ArrayList<>();
        confirmation.confirmations().forEach(c -> {
            TblEventInvitation eventInvitation = tblEventInvitationRepository.findById_EviEventAndId_EviInvitationAndEviInvitation_InvUuid(
                    c.eventId(), confirmation.invitationId(), confirmation.token()
            ).orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "No se pudo confirmar la asistencia ya que el uno de los eventos no se encuentra asociado a la invitación"));
            final String confirmationTag = c.confirmationType() == ConfirmationType.CONFIRM ? "C" : "D";
            eventInvitation.setEviStatus(confirmationTag);
            modified.add(eventInvitation);
        });
        tblEventInvitationRepository.saveAll(modified);
    }
}
