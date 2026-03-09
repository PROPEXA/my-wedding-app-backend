package org.wedding.app.mapper;

import org.wedding.app.dto.EventTypeDto;
import org.wedding.app.model.TblEventType;

public final class EventTypeMapper {

    /**
     * Convierte una entidad de tipo TblEventType en un objeto de tipo EventTypeDto.
     *
     * @param entity la entidad TblEventType que contiene los datos a convertir.
     * @return un objeto de tipo EventTypeDto con los datos mapeados desde la entidad TblEventType.
     */
    public static EventTypeDto toDto(TblEventType entity) {
        return new EventTypeDto(entity.getId(), entity.getEvtName(),
                entity.getEvtRegister(),
                entity.getEvtModified());
    }
}
