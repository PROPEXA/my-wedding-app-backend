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
     * Recupera una lista de todas las bodas asociadas a una cuenta específica.
     *
     * @param accountId Identificador único de la cuenta asociada a las bodas.
     * @return Una lista de objetos TblWedding que representan las bodas relacionadas con la cuenta dada.
     */
    List<TblWedding> findAllByWedAccount(Integer accountId);
}
