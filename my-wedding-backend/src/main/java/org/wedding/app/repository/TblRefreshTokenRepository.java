package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblRefreshToken;

import java.util.List;

@Repository
public interface TblRefreshTokenRepository extends JpaRepository<TblRefreshToken, String> {

    List<TblRefreshToken> findByTkAccount(Integer tkAccount);
}
