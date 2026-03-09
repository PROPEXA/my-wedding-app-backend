package org.wedding.app.mapper;

import org.apache.commons.text.WordUtils;
import org.wedding.app.dto.EventDto;
import org.wedding.app.model.TblEvent;

public final class EventMapper {

    public static EventDto toDto(TblEvent entity) {
        return new EventDto(entity.getId(),
                entity.getEveDateIni(),
                entity.getEveDateFin(),
                entity.getEveTitle(),
                null,
                EventTypeMapper.toDto(entity.getEveTypeObj()),
                entity.getEveAddress(),
                entity.getEveLocLat(),
                entity.getEveLocLng(),
                entity.getEveSequence(),
                entity.getEveWedding(),
                null,
                entity.getEveRegister(),
                entity.getEveWeddingObj().getWedUpdated(),
                entity.getEveStatus().equals("A")
        );
    }

    public static TblEvent toUpdate(EventDto dto, TblEvent entity) {
        entity.setEveDateIni(dto.startDate());
        entity.setEveDateFin(dto.endDate());
        entity.setEveTitle(WordUtils.capitalize(dto.title()));
        entity.setEveAddress(WordUtils.capitalize(dto.address()));
        entity.setEveLocLat(dto.latitude());
        entity.setEveLocLng(dto.longitude());
        return entity;
    }

    public static TblEvent toEntity(EventDto dto) {
        return TblEvent.builder()
                .eveDateIni(dto.startDate())
                .eveDateFin(dto.endDate())
                .eveTitle(WordUtils.capitalize(dto.title()))
                .eveType(dto.eventTypeId())
                .eveAddress(WordUtils.capitalize(dto.address()))
                .eveLocLat(dto.latitude())
                .eveLocLng(dto.longitude())
                .eveWedding(dto.weddingId())
                .eveStatus("A")
                .build();
    }
}
