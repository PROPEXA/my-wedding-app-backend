package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblAccount;

import java.util.List;

@Repository
public interface TblAccountRepository extends JpaRepository<TblAccount,Integer> {


}
