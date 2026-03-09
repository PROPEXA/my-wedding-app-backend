package org.wedding.app.mapper;

import org.apache.commons.text.WordUtils;
import org.wedding.app.dto.WeddingDto;
import org.wedding.app.model.TblWedding;

public final class WeddingMapper {

    /**
     * Convierte un objeto de tipo WeddingDto en una entidad TblWedding.
     *
     * @param dto el objeto WeddingDto que contiene los datos a convertir.
     * @return una instancia de TblWedding con los datos mapeados desde el objeto WeddingDto.
     */
    public static TblWedding toEntity(WeddingDto dto) {
        return TblWedding.builder()
                //.wedAccount() Insertado por auditoria
                .wedBrideFn(WordUtils.capitalize(dto.brideFirstname()))
                .wedBrideLn(WordUtils.capitalize(dto.brideLastname()))
                .wedBrideBr((dto.brideBirthdate()))
                .wedBrideEma(dto.brideEmail())
                .wedBrideTel(dto.bridePhone())
                .wedGroomFn(WordUtils.capitalize(dto.groomFirstname()))
                .wedGroomLn(WordUtils.capitalize(dto.groomLastname()))
                .wedGroomBr(dto.groomBirthdate())
                .wedGroomEma(dto.groomEmail())
                .wedGroomTel(dto.groomPhone())
                .wedStatus("A")
                .build();
    }

    /**
     * Actualiza una entidad de tipo TblWedding con información de un objeto WeddingDto.
     *
     * @param dto el objeto WeddingDto que contiene la información actualizada de la boda.
     * @return una entidad TblWedding con los datos actualizados a partir del objeto WeddingDto.
     */
    public static TblWedding toUpdate(WeddingDto dto, TblWedding entity) {
        entity.setWedBrideFn(WordUtils.capitalize(dto.brideFirstname()));
        entity.setWedBrideLn(WordUtils.capitalize(dto.brideLastname()));
        entity.setWedBrideBr(dto.brideBirthdate());
        entity.setWedBrideEma(dto.brideEmail());
        entity.setWedBrideTel(dto.bridePhone());
        entity.setWedGroomFn(WordUtils.capitalize(dto.groomFirstname()));
        entity.setWedGroomLn(WordUtils.capitalize(dto.groomLastname()));
        entity.setWedGroomBr(dto.groomBirthdate());
        entity.setWedGroomEma(dto.groomEmail());
        entity.setWedGroomTel(dto.groomPhone());
        return entity;
    }

    /**
     * Convierte una entidad de tipo TblWedding en un objeto de tipo WeddingDto.
     *
     * @param entity la entidad TblWedding que contiene los datos a convertir.
     * @return un objeto de tipo WeddingDto con los datos mapeados desde la entidad TblWedding.
     */
    public static WeddingDto toDto(TblWedding entity) {
        return new WeddingDto(
                entity.getId(),
                entity.getWedAccount(),
                entity.getWedBrideFn(),
                entity.getWedBrideLn(),
                entity.getWedBrideBr(),
                entity.getWedBrideEma(),
                entity.getWedBrideTel(),
                entity.getWedGroomFn(),
                entity.getWedGroomLn(),
                entity.getWedGroomBr(),
                entity.getWedGroomEma(),
                entity.getWedGroomTel(),
                entity.getWedRegister(),
                entity.getWedUpdated(),
                entity.getWedStatus().equalsIgnoreCase("A")
        );
    }

}
