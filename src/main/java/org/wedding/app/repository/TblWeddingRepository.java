package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblWedding;

import java.util.List;
import java.util.Optional;

@Repository
public interface TblWeddingRepository extends JpaRepository<TblWedding, Integer> {

    /**
     * Busca un registro de boda en la base de datos basado en los parámetros proporcionados: ID, cuenta de boda y estado de boda.
     *
     * @param id         Identificador único de la boda.
     * @param wedAccount Identificador de la cuenta asociada a la boda.
     * @param wedStatus  Estado actual de la boda.
     * @return Un objeto Optional que contiene el registro de la boda si se encuentra, o vacío si no coincide ningún registro.
     */
    Optional<TblWedding> findByIdAndWedAccountAndWedStatus(Integer id, Integer wedAccount, String wedStatus);

    /**
     * Retrieves a list of wedding records from the database that match the given wedding account identifier
     * and wedding status.
     *
     * @param accountId the unique identifier of the wedding account.
     * @param status    the current status of the wedding (e.g., A = Active, I = Inactive).
     * @return a list of {@code TblWedding} objects that match the specified account and status, or an empty list
     * if no matching records are found.
     */
    List<TblWedding> findAllByWedAccountAndWedStatus(Integer accountId, String status);

    /**
     * Verifica si existe un registro de boda en la base de datos que coincida con el identificador de la boda
     * y el identificador de la cuenta de boda proporcionados.
     *
     * @param id        Identificador único de la boda.
     * @param accountId Identificador único de la cuenta asociada a la boda.
     * @return true si existe un registro de boda que coincida con los parámetros proporcionados, false en caso contrario.
     */
    boolean existsByIdAndWedAccount(Integer id, Integer accountId);
}
