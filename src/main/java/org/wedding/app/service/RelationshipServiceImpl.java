package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.wedding.app.dto.RelationshipDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.RelationshipMapper;
import org.wedding.app.model.TblRelationship;
import org.wedding.app.repository.TblRelationshipRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RelationshipServiceImpl implements RelationshipService {

    private final TblRelationshipRepository tblRelationshipRepository;

    @Override
    @Cacheable(value = "relationships", key = "'all'")
    public List<RelationshipDto> getAllRelationships() {
        List<TblRelationship> relationships = tblRelationshipRepository.findAll();
        if (relationships.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay tipos de relaciones registrados");
        }
        return relationships.stream().map(RelationshipMapper::toDto).toList();
    }

    @Override
    @Cacheable(value = "relationships", key = "#id")
    public RelationshipDto getRelationshipById(Integer id) {
        return RelationshipMapper.toDto(
                tblRelationshipRepository.findById(id)
                        .orElseThrow(() -> new ServiceException(
                                HttpStatus.NOT_FOUND,
                                "Tipo de relación no encontrado"))
        );
    }
}
