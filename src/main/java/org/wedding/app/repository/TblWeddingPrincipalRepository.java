package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblWeddingPrincipal;

import java.util.List;
import java.util.Optional;

@Repository
public interface TblWeddingPrincipalRepository extends JpaRepository<TblWeddingPrincipal, Integer> {

    List<TblWeddingPrincipal> findByWpWeddingAndWpStatus(Integer wpWedding, String wpStatus);

    Optional<TblWeddingPrincipal> findByIdAndWpWeddingAndWpStatus(Integer id, Integer wpWedding, String wpStatus);

}
