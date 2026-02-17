package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.wedding.app.dto.EventTypeDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.EventTypeMapper;
import org.wedding.app.model.TblEventType;
import org.wedding.app.repository.TblEventTypeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeddingEventServiceImpl implements WeddingEventTypeService {

    private final TblEventTypeRepository tblEventTypeRepository;

    @Override
    @Cacheable(value = "event_type_list", key = "'all_types'")
    public List<EventTypeDto> obtainEventList() {
        List<TblEventType> eventTypes = tblEventTypeRepository.findAll();
        if (eventTypes.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay  tipos de eventos registrados");
        }
        return eventTypes.stream().map(EventTypeMapper::toDto).toList();
    }

    @Override
    @Cacheable(value = "event_type", key = "#id")
    public EventTypeDto obtainEventById(int id) {
        TblEventType tblEventType = tblEventTypeRepository.findById(id)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Tipo de evento no encontrado"));
        return EventTypeMapper.toDto(tblEventType);
    }
}
