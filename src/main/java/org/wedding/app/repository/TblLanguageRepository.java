package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblLanguage;

@Repository
public interface TblLanguageRepository extends JpaRepository<TblLanguage, String> {
}
