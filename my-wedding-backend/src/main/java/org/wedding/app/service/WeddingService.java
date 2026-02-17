package org.wedding.app.service;

import org.wedding.app.dto.WeddingDto;

import java.util.List;

public interface WeddingService {

    int saveWedding(WeddingDto weddingDto);

    WeddingDto obtainWeddingById(Integer id);

    void deleteWeddingById(Integer id);

    void updateWedding(WeddingDto weddingDto);

    List<WeddingDto> obtainAllMyWeddings();
}
