package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblEvent;

import java.util.List;
import java.util.Optional;

@Repository
public interface TblEventRepository extends JpaRepository<TblEvent, Integer> {

    /**
     * Busca un evento por su identificador único y el identificador del usuario que lo creó.
     *
     * @param id        el identificador único del evento (eve_id).
     * @param createdBy el identificador del usuario que creó el evento (eve_created_by).
     * @param status    el estado actual del evento (eve_status).
     * @return un {@code Optional} que contiene el {@code TblEvent} si se encuentra uno que coincida
     * con los criterios, o un {@code Optional} vacío si no se encuentra.
     */
    Optional<TblEvent> findByIdAndEveCreatedByAndEveStatus(Integer id, Integer createdBy, String status);

    /**
     * Obtiene una lista de todos los eventos creados por un usuario específico.
     *
     * @param createdBy el identificador del usuario que creó los eventos (eve_created_by).
     * @return una lista de objetos {@code TblEvent} asociados al usuario especificado.
     */
    List<TblEvent> findAllByEveCreatedByAndEveWeddingAndEveStatus(Integer createdBy, Integer weddingId, String status);
}
