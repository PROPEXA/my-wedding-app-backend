package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wedding.app.model.TblAccountConfirmation;

public interface TblAccountConfirmationRepository extends JpaRepository<TblAccountConfirmation,String> {
}
