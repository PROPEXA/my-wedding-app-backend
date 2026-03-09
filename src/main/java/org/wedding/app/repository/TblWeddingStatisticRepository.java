package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.wedding.app.dto.StatisticDto;
import org.wedding.app.model.TblWeddingStatistic;

import java.util.List;
import java.util.Optional;

@Repository
public interface TblWeddingStatisticRepository extends JpaRepository<TblWeddingStatistic, Integer> {

    /**
     * Recupera una lista de estadísticas asociadas a un identificador de boda específico.
     *
     * @param weddingId el identificador único de la boda para la cual se desean obtener las estadísticas.
     * @return una lista de objetos {@code TblWeddingStatistic} que contienen las estadísticas relacionadas con la boda indicada.
     */
    @Query(value = """
            select new org.wedding.app.dto.StatisticDto(
                        s.weddingId,
                        sum(s.invitations),
                        sum(s.confirmed),
                        sum(s.declined),
                        sum(s.waiting),
                        sum(s.peopleConfirmed),
                        sum(s.peopleDeclined),
                        sum(s.peopleWaiting)
            )
            from TblWeddingStatistic s
            where s.weddingId = :weddingId
            group by s.weddingId
            """)
    StatisticDto findByWeddingId(Integer weddingId);

    @Query(value = """
            select new org.wedding.app.dto.StatisticDto(
                        s.weddingId,
                        s.eventId,
                        s.invitations,
                        s.confirmed,
                        s.declined,
                        s.waiting,
                        s.peopleConfirmed,
                        s.peopleDeclined,
                        s.peopleWaiting
            )
            from TblWeddingStatistic s
            where s.weddingId = :weddingId
            """)
    List<StatisticDto> findAllEventsByWeddingId(Integer weddingId);

    @Query(value = """
            select new org.wedding.app.dto.StatisticDto(
                        s.weddingId,
                        s.eventId,
                        s.invitations,
                        s.confirmed,
                        s.declined,
                        s.waiting,
                        s.peopleConfirmed,
                        s.peopleDeclined,
                        s.peopleWaiting
            )
            from TblWeddingStatistic s
            where s.eventId = :eventId
            """)
    StatisticDto findEventByEventId(Integer eventId);

}
