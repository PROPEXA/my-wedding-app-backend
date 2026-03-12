package org.wedding.app.mapper;

import org.wedding.app.dto.RelationshipDto;
import org.wedding.app.dto.enums.Gender;
import org.wedding.app.model.TblRelationship;

public final class RelationshipMapper {

    public static RelationshipDto toDto(TblRelationship entity){
        return new RelationshipDto(
                entity.getId(),
                entity.getRelName(),
                entity.getRelDescription(),
                Gender.fromCode(entity.getRelGender()),
                entity.getRelStatus().equalsIgnoreCase("A")
        );
    }
}
