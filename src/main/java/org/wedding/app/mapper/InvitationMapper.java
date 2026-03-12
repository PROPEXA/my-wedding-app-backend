package org.wedding.app.mapper;

import org.wedding.app.dto.*;
import org.wedding.app.dto.enums.ConfirmationType;
import org.wedding.app.model.TblInvitation;

import java.util.List;
import java.util.UUID;

public final class InvitationMapper {

    public static TblInvitation toEntity(InvitationDto dto) {
        List<InvitationGuestDto> guests = new java.util.ArrayList<>();
        for (int i = 0; i < dto.guests().size(); i++) {
            InvitationGuestDto guest = dto.guests().get(i);
            guests.add(new InvitationGuestDto(i + 1, guest.email(), guest.fullName()));
        }
        return TblInvitation.builder()
                .invTitle(dto.title().toUpperCase())
                .invQuantity(dto.quantity())
                .invRelation(dto.relationId())
                .invTablenum(dto.tableNumber() == null ? "N/A" : dto.tableNumber())
                .invMaxconf(dto.maxConfirmation())
                .guests(guests)
                .invUuid(UUID.randomUUID().toString())
                .build();
    }

    private static InvitationDto toDto(TblInvitation entity,
                                       List<EventDto> events,
                                       List<ConfirmationDto.Confirm> confirmations,
                                       WeddingDto wedding) {
        return new InvitationDto(
                entity.getId(),
                entity.getInvTitle(),
                entity.getInvQuantity(),
                null,
                RelationMapper.toDto(entity.getRelation()),
                entity.getInvTablenum(),
                entity.getInvMaxconf(),
                entity.getInvRegister(),
                entity.getInvModified(),
                entity.getGuests(),
                null,
                events,
                confirmations,
                entity.getInvUuid(),
                wedding
        );
    }

    public static InvitationDto toDto(TblInvitation entity) {
        return toDto(entity, null, null, null);
    }

    public static InvitationDto toDto(TblInvitation entity, boolean withEvents) {
        if (withEvents) {
            return toDto(entity, events(entity), null, null);
        }
        return toDto(entity);
    }

    private static List<EventDto> events(TblInvitation entity) {
        return entity.getEvents().stream().map(EventMapper::toDto).toList();
    }

    public static InvitationDto toDto(TblInvitation entity, boolean withEvents, boolean withConfirmations) {
        List<EventDto> events = withEvents ? events(entity) : null;
        List<ConfirmationDto.Confirm> confirmations = withConfirmations ? confirmations(entity) : null;
        return toDto(entity, events, confirmations, null);
    }

    private static List<ConfirmationDto.Confirm> confirmations(TblInvitation entity) {
        return entity.getEventInvitations().stream()
                .filter(e -> e.getEviStatus().equalsIgnoreCase("C") || e.getEviStatus().equalsIgnoreCase("D"))
                .map(e -> switch (e.getEviStatus()) {
                    case "C" -> new ConfirmationDto.Confirm(e.getId().getEviEvent(), ConfirmationType.CONFIRM);
                    case "D" -> new ConfirmationDto.Confirm(e.getId().getEviEvent(), ConfirmationType.DECLINE);
                    default -> null;
                })
                .toList();
    }

    public static InvitationDto toDto(TblInvitation entity, boolean withEvents, boolean withConfirmations, boolean withWedding) {
        List<EventDto> events = withEvents ? events(entity) : null;
        List<ConfirmationDto.Confirm> confirmations = withConfirmations ? confirmations(entity) : null;
        WeddingDto wedding = withWedding ? wedding(entity, false) : null;
        return toDto(entity, events, confirmations, wedding);
    }

    public static InvitationDto toDto(TblInvitation entity, boolean withEvents, boolean withConfirmations, boolean withWedding, boolean withPrincipal) {
        List<EventDto> events = withEvents ? events(entity) : null;
        List<ConfirmationDto.Confirm> confirmations = withConfirmations ? confirmations(entity) : null;
        WeddingDto wedding = withWedding ? wedding(entity, withPrincipal) : null;
        return toDto(entity, events, confirmations, wedding);
    }

    private static WeddingDto wedding(TblInvitation entity, boolean withPrincipal) {
        return WeddingMapper.toDto(entity.getEventInvitations().get(0).getEviEvent().getEveWeddingObj(), withPrincipal);
    }
}
