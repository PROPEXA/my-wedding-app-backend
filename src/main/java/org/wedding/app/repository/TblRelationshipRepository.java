package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblRelationship;

@Repository
public interface TblRelationshipRepository extends JpaRepository<TblRelationship, Integer> {
}
