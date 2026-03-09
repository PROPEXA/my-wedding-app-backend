package org.wedding.app.service;

import org.wedding.app.dto.RelationDto;

import java.util.List;

public interface RelationService {

    RelationDto getRelationById(Integer id);

    List<RelationDto> getAllRelations();

}
