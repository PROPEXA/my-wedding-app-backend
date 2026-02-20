package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.wedding.app.dto.StatisticDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.repository.TblWeddingStatisticRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticServiceImpl implements StatisticService {

    private final TblWeddingStatisticRepository tblWeddingStatisticRepository;

    @Override
    public StatisticDto obtainWeddingStatisticsByWeddingId(Integer weddingId) {
        StatisticDto dto = tblWeddingStatisticRepository.findByWeddingId(weddingId);
        if (dto == null) {
            throw new ServiceException(HttpStatus.NOT_FOUND,"No se encontraron estadísticas para la boda solicitada");
        }
        return dto;
    }

    @Override
    public List<StatisticDto> obtainAllWeddingStatistics() {
        return List.of();
    }

    @Override
    public StatisticDto obtainEventStatisticsByEventId(Integer eventId) {
        StatisticDto dto = tblWeddingStatisticRepository.findEventByEventId(eventId);
        if (dto == null) {
            throw new ServiceException(HttpStatus.NOT_FOUND,"No se encontraron estadísticas para el evento solicitado");
        }
        return dto;
    }

    @Override
    public List<StatisticDto> obtainAllEventStatisticsByWeddingId(Integer weddingId) {
        List<StatisticDto> list = tblWeddingStatisticRepository.findAllEventsByWeddingId(weddingId);
        if(list.isEmpty()){
            throw new ServiceException(HttpStatus.NOT_FOUND, "No se encontraron estadísticas de eventos para la boda solicitada");
        }
        return list;
    }
}
