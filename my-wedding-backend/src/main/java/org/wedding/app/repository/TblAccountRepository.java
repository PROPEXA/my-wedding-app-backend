package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblAccount;

@Repository
public interface TblAccountRepository extends JpaRepository<TblAccount,Integer> {

    boolean existsByUsername(String username);

}
