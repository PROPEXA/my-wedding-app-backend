package org.wedding.app.service;

import org.wedding.app.dto.WeddingDto;

import java.util.List;

public interface WeddingService {

    int saveWedding(WeddingDto wedding);

    WeddingDto obtainWeddingById(Integer weddingId);

    void deleteWeddingById(int weddingId, int accountId);

    void updateWedding(WeddingDto weddingDto, int accountId);

    List<WeddingDto> obtainAllMyWeddingsByStatus(int accountId, String status);
}
