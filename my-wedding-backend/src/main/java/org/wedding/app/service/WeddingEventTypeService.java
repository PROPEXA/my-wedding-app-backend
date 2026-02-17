package org.wedding.app.service;

import org.wedding.app.dto.EventTypeDto;

import java.util.List;

public interface WeddingEventTypeService {

    List<EventTypeDto> obtainEventList();

    EventTypeDto obtainEventById(int id);

}
