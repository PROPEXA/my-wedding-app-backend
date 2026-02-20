package org.wedding.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.WeddingDto;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.WeddingMapper;
import org.wedding.app.model.TblWedding;
import org.wedding.app.repository.TblWeddingRepository;
import org.wedding.app.security.AuthUtil;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WeddingServiceImpl implements WeddingService {

    private final TblWeddingRepository tblWeddingRepository;

    @Override
    @Transactional
    public int saveWedding(WeddingDto weddingDto) {
        TblWedding tblWedding = WeddingMapper.toEntity(weddingDto);
        final TblWedding persisted = tblWeddingRepository.save(tblWedding);
        return persisted.getId();
    }

    @Override
    @Cacheable(value = "wedding", key = "#id")
    public WeddingDto obtainWeddingById(Integer id) {
        int accountId = getAccountId();
        TblWedding tblAccount = tblWeddingRepository.findByIdAndWedAccountAndWedStatus(id, accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "No se encontró la boda solicitada o se encuentra inactiva"));
        return WeddingMapper.toDto(tblAccount);
    }

    @Override
    @Transactional
    @CacheEvict(value = "wedding", key = "#id")
    public void deleteWeddingById(Integer id) {
        int accountId = getAccountId();
        tblWeddingRepository.findByIdAndWedAccountAndWedStatus(id, accountId, "A")
                .ifPresent((tbl) -> {
                    tbl.setWedStatus("I");
                    tblWeddingRepository.save(tbl);
                });
    }

    @Override
    @Transactional
    @CacheEvict(value = "wedding", key = "#weddingDto.id()")
    public void updateWedding(WeddingDto weddingDto) {
        final int accountId = getAccountId();
        final TblWedding persisted = tblWeddingRepository.findByIdAndWedAccountAndWedStatus(weddingDto.id(), accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "La boda a actualizar no existe"));
        tblWeddingRepository.save(
                WeddingMapper.toUpdate(weddingDto, persisted));
    }

    @Override
    public List<WeddingDto> obtainAllMyWeddings() {
        int accountId = getAccountId();
        List<TblWedding> myWeddings = tblWeddingRepository.findAllByWedAccount(accountId);
        if (myWeddings.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay bodas registradas");
        }
        return myWeddings.stream().map(WeddingMapper::toDto).toList();
    }

    private int getAccountId() {
        return AuthUtil.getCurrentUserId().orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "No se pudo verificar la identidad del usuario"));
    }
}
