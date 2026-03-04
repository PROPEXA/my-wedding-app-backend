package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblRelation;

@Repository
public interface TblRelationRepository extends JpaRepository<TblRelation, Integer> {
}
