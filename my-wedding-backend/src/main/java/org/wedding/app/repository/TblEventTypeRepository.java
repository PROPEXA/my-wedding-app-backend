package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblEventType;

@Repository
public interface TblEventTypeRepository extends JpaRepository<TblEventType,Integer> {
}
