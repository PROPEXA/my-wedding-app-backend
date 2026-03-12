package org.wedding.app.service;

import org.wedding.app.dto.PrincipalDto;

import java.util.List;

public interface PrincipalService {

    void saveNewPrincipals(List<PrincipalDto> principalList, int weddingId, int accountId);

    void saveNewPrincipals(List<PrincipalDto> principalList, int weddingId);

    PrincipalDto obtainPrincipalByWeddingIdAndPrincipalId(int weddingId, int principalId, int accountId);

    List<PrincipalDto> obtainPrincipalByWeddingId(int weddingId, int accountId);

    void deletePrincipalByWeddingIdAndPrincipalId(int weddingId, int principalId, int accountId);

    void updatePrincipal(PrincipalDto principal, int weddingId, int principalId, int accountId);
}
