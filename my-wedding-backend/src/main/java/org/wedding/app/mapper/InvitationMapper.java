package org.wedding.app.mapper;

import org.wedding.app.dto.ConfirmationDto;
import org.wedding.app.dto.InvitationDto;
import org.wedding.app.dto.InvitationGuestDto;
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

    public static InvitationDto toDto(TblInvitation entity, boolean withEvents, boolean withConfirmations) {
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
                withEvents ? entity.getEvents().stream().map(EventMapper::toDto).toList() : null,
                withConfirmations ? entity.getEventInvitations().stream()
                        .map(e -> {
                            return switch (e.getEviStatus()) {
                                case "C" ->
                                        new ConfirmationDto.Confirm(e.getId().getEviEvent(), ConfirmationType.CONFIRM);
                                case "D" ->
                                        new ConfirmationDto.Confirm(e.getId().getEviEvent(), ConfirmationType.DECLINE);
                                case "P" ->
                                        new ConfirmationDto.Confirm(e.getId().getEviEvent(), ConfirmationType.PENDING);
                                default -> null;
                            };
                        })
                        .toList() : null,
                entity.getInvUuid()
        );
    }
}
