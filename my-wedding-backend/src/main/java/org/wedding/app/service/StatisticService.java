package org.wedding.app.service;

import org.wedding.app.dto.StatisticDto;

import java.util.List;

public interface StatisticService {


    /**
     * Obtiene las estadísticas relacionadas con una boda específica utilizando su identificador único.
     *
     * @param weddingId Identificador único de la boda para la cual se desean obtener las estadísticas.
     *                  Este parámetro no debe ser nulo.
     * @return Un objeto {@code StatisticDto} que contiene información estadística sobre la boda,
     * incluyendo datos como invitaciones enviadas, confirmaciones recibidas, rechazos, pendientes,
     * personas confirmadas, personas que han declinado, personas en espera, y la última fecha de actualización.
     */
    StatisticDto obtainWeddingStatisticsByWeddingId(Integer weddingId);

    /**
     * Obtiene una lista de estadísticas relacionadas con todas las bodas disponibles.
     *
     * @return una lista de objetos {@code StatisticDto} que contienen estadísticas tales como
     * invitaciones enviadas, confirmaciones recibidas, rechazos, pendientes,
     * y otros detalles relevantes para todas las bodas.
     */
    List<StatisticDto> obtainAllWeddingStatistics();

    /**
     * Obtiene las estadísticas relacionadas con un evento específico utilizando su identificador único.
     *
     * @param eventId Identificador único del evento para el cual se desean obtener las estadísticas.
     * @return Un objeto {@code StatisticDto} que contiene información estadística del evento,
     * incluyendo invitaciones, confirmaciones, rechazos, pendientes, personas confirmadas,
     * personas que han declinado, personas en espera, y la última fecha de actualización.
     */
    StatisticDto obtainEventStatisticsByEventId(Integer eventId);

    /**
     * Obtiene una lista de estadísticas relacionadas con todos los eventos asociados a una boda específica.
     *
     * @param weddingId Identificador único de la boda cuyos eventos relacionados se desean obtener.
     * @return Una lista de objetos {@code StatisticDto}, donde cada objeto contiene datos estadísticos
     * de eventos como invitaciones enviadas, confirmaciones recibidas, rechazos, pendientes,
     * personas confirmadas, personas que han declinado, personas en espera, y la última fecha de actualización.
     */
    List<StatisticDto> obtainAllEventStatisticsByWeddingId(Integer weddingId);

}
