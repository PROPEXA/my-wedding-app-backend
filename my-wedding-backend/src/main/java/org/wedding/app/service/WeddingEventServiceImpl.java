package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.EventDto;
import org.wedding.app.dto.EventTypeDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.EventMapper;
import org.wedding.app.mapper.EventTypeMapper;
import org.wedding.app.model.TblEvent;
import org.wedding.app.model.TblEventType;
import org.wedding.app.repository.TblEventRepository;
import org.wedding.app.repository.TblEventTypeRepository;
import org.wedding.app.repository.TblWeddingRepository;
import org.wedding.app.security.AuthUtil;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeddingEventServiceImpl implements WeddingEventTypeService, WeddingEventService {

    private final TblEventTypeRepository tblEventTypeRepository;
    private final TblWeddingRepository tblWeddingRepository;
    private final TblEventRepository tblEventRepository;

    @Override
    @Cacheable(value = "event_type_list", key = "'all_types'")
    public List<EventTypeDto> obtainEventTypeList() {
        List<TblEventType> eventTypes = tblEventTypeRepository.findAll();
        if (eventTypes.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay  tipos de eventos registrados");
        }
        return eventTypes.stream().map(EventTypeMapper::toDto).toList();
    }

    @Override
    @Transactional
    public int saveNewEvent(EventDto dto) {
        boolean exists = tblWeddingRepository.existsByIdAndWedAccount(dto.weddingId(), getAccountId());
        if (!exists) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "El código de boda proporcionado no existe");
        }
        TblEvent toPersist = EventMapper.toEntity(dto);
        TblEvent persisted = tblEventRepository.save(toPersist);
        return persisted.getId();
    }

    @Override
    @Cacheable(value = "event", key = "#id")
    public EventDto obtainEventById(int id) {
        int accountId = getAccountId();
        final TblEvent event = tblEventRepository.findByIdAndEveCreatedByAndEveStatus(id, accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        return EventMapper.toDto(event);
    }

    @Override
    @Cacheable(value = "event_type", key = "#id")
    public EventTypeDto obtainEventTypeById(int id) {
        TblEventType tblEventType = tblEventTypeRepository.findById(id)
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Tipo de evento no encontrado"));
        return EventTypeMapper.toDto(tblEventType);
    }

    @Override
    @Transactional
    @CacheEvict(value = "event", key = "#id")
    public void deleteEventById(int id) {
        int accountId = getAccountId();
        TblEvent event = tblEventRepository.findByIdAndEveCreatedByAndEveStatus(id, accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        event.setEveStatus("I");
        tblEventRepository.save(event);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "event", key = "#dto.id()"),
            @CacheEvict(value = "wedding_events", key = "#dto.weddingId()")
    })
    public void updateEvent(EventDto dto) {
        int accountId = getAccountId();
        TblEvent event = tblEventRepository.findByIdAndEveCreatedByAndEveStatus(dto.id(), accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "Evento no encontrado para actualizar"));
        tblEventRepository.save(EventMapper.toUpdate(dto, event));
    }

    @Override
    @Cacheable(value = "wedding_events", key = "#weddingId")
    public List<EventDto> obtainAllMyWeddingEvents(int weddingId) {
        int accountId = getAccountId();
        List<TblEvent> events = tblEventRepository.findAllByEveCreatedByAndEveWeddingAndEveStatus(accountId, weddingId,"A");
        if (events.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay eventos registrados");
        }
        return events.stream().map(EventMapper::toDto).toList();
    }

    private int getAccountId() {
        return AuthUtil.getCurrentUserId()
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "No se pudo verificar la identidad del usuario"));
    }
}
