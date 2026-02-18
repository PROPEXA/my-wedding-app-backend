package org.wedding.app.service;

import org.wedding.app.dto.EventDto;

import java.util.List;

public interface WeddingEventService {

    /**
     * Guarda un nuevo evento en el sistema.
     *
     * @param dto objeto {@code EventDto} que contiene todos los detalles del nuevo evento a registrar.
     *            Este incluye información como id, fechas, título, tipo de evento, dirección, coordenadas,
     *            identificación de boda, entre otros.
     * @return un entero que representa el identificador único del evento recién creado.
     */
    int saveNewEvent(EventDto dto);

    /**
     * Obtiene un evento específico del sistema utilizando su identificador único.
     *
     * @param id el identificador único del evento que se desea obtener
     * @return un objeto {@code EventDto} que contiene los detalles del evento correspondiente al identificador proporcionado
     */
    EventDto obtainEventById(int id);

    /**
     * Elimina un evento del sistema basado en su identificador único.
     *
     * @param id el identificador único del evento que se desea eliminar
     */
    void deleteEventById(int id);

    /**
     * Actualiza los detalles de un evento existente en el sistema.
     *
     * @param dto objeto {@code EventDto} que contiene los datos actualizados del evento.
     *            Debe incluir información como id, fechas, título, tipo de evento, dirección,
     *            coordenadas, identificación de boda, entre otros.
     */
    void updateEvent(EventDto dto);

    /**
     * Obtiene una lista de todos los eventos asociados al usuario actual.
     *
     * @return una lista de objetos {@code EventDto}, cada uno representando un evento específico
     * con información detallada como fechas, título, tipo, ubicación, y otros atributos
     * relevantes.
     */
    List<EventDto> obtainAllMyWeddingEvents(int weddingId);

}
