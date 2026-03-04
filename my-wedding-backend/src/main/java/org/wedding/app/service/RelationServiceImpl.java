package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.wedding.app.dto.RelationDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.RelationMapper;
import org.wedding.app.model.TblRelation;
import org.wedding.app.repository.TblRelationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RelationServiceImpl implements RelationService {

    private final TblRelationRepository tblRelationRepository;


    @Override
    @Cacheable(value = "relations", key = "#id")
    public RelationDto getRelationById(Integer id) {
        TblRelation relation = tblRelationRepository.findById(id)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "No se encontró los tipos de relaciones"));
        return RelationMapper.toDto(relation);
    }

    @Override
    @Cacheable(value = "relations_list", key = "'all'")
    public List<RelationDto> getAllRelations() {
        List<TblRelation> relations = tblRelationRepository.findAll();
        return relations.stream().map(RelationMapper::toDto).toList();
    }
}
