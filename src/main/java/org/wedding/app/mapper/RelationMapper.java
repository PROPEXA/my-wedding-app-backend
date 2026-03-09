package org.wedding.app.mapper;

import org.wedding.app.dto.RelationDto;
import org.wedding.app.model.TblRelation;

public final class RelationMapper {

    public static RelationDto toDto(TblRelation entity){
        return new RelationDto(entity.getId(),entity.getRlName());
    }

}
