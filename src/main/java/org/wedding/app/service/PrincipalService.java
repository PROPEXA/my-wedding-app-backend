package org.wedding.app.service;

import org.wedding.app.dto.PrincipalDto;

import java.util.List;

public interface PrincipalService {

    int saveNewPrincipal(PrincipalDto principal);

    void saveNewPrincipalList(List<PrincipalDto> principalList, int weddingId);

    PrincipalDto obtainPrincipalByWeddingIdAndPrincipalId(int weddingId, int principalId);

    List<PrincipalDto> obtainPrincipalByWeddingId(int weddingId);

    void deletePrincipalByWeddingIdAndPrincipalId(int weddingId, int principalId);

    void updatePrincipal(PrincipalDto principal);
}
