package org.wedding.app.service;


import org.wedding.app.dto.RelationshipDto;

import java.util.List;

public interface RelationshipService {

    List<RelationshipDto> getAllRelationships();

    RelationshipDto getRelationshipById(Integer id);
}
