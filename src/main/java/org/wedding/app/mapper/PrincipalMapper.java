package org.wedding.app.mapper;

import org.apache.commons.text.WordUtils;
import org.wedding.app.dto.PrincipalDto;
import org.wedding.app.dto.enums.PrincipalType;
import org.wedding.app.model.TblWeddingPrincipal;

public final class PrincipalMapper {

    public static PrincipalDto toDto(TblWeddingPrincipal entity, boolean withRelationship) {
        return new PrincipalDto(
                entity.getId(),
                PrincipalType.fromCode(entity.getWpType()),
                entity.getWpFn(),
                entity.getWpLn(),
                entity.getWpBr(),
                entity.getWpEmail(),
                entity.getWpPhone(),
                entity.getWpRegistered(),
                entity.getWpUpdated(),
                entity.getWpStatus().equalsIgnoreCase("A"),
                entity.getWpWedding(),
                null,
                (withRelationship ? RelationshipMapper.toDto(entity.getWpRelationObj()) : null)
        );
    }

    public static TblWeddingPrincipal toUpdate(PrincipalDto dto, TblWeddingPrincipal entity) {
        entity.setWpType(dto.type().getCode());
        entity.setWpFn(WordUtils.capitalize(dto.firstName()));
        entity.setWpLn(WordUtils.capitalize(dto.lastName()));
        entity.setWpBr(dto.birthDate());
        entity.setWpEmail(dto.email() != null ? dto.email().toLowerCase() : null);
        entity.setWpPhone(dto.phone());
        entity.setWpRelation(dto.relationshipId());
        return entity;
    }

    public static TblWeddingPrincipal toEntity(int weddingId, PrincipalDto dto) {
        return TblWeddingPrincipal.builder()
                .wpType(dto.type().getCode())
                .wpFn(WordUtils.capitalize(dto.firstName()))
                .wpLn(WordUtils.capitalize(dto.lastName()))
                .wpBr(dto.birthDate())
                .wpEmail(dto.email() != null ? dto.email().toLowerCase() : null)
                .wpPhone(dto.phone())
                .wpWedding(weddingId)
                .wpRelation(dto.relationshipId())
                .build();
    }
}
