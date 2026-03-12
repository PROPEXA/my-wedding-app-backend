package org.wedding.app.service;

//import jakarta.validation.ConstraintViolation;
//import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.PrincipalDto;
import org.wedding.app.dto.WeddingDto;
//import org.wedding.app.dto.group.Post;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.WeddingMapper;
import org.wedding.app.model.TblWedding;
import org.wedding.app.repository.TblWeddingRepository;
import org.wedding.app.security.AuthUtil;

import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeddingServiceImpl implements WeddingService {

    private final TblWeddingRepository tblWeddingRepository;
    private final PrincipalService principalService;
//    private final Validator validator;

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "weddings", key = "#accountId"),
    })
    public int saveWedding(WeddingDto wedding, int accountId) {
        TblWedding tblWedding = WeddingMapper.toEntity(wedding);
        final TblWedding persisted = tblWeddingRepository.saveAndFlush(tblWedding);
        if (null != wedding.principals() && !wedding.principals().isEmpty()) {
            principalService.saveNewPrincipals(wedding.principals(), persisted.getId());
        }
        return persisted.getId();
    }

    @Override
    @Cacheable(value = "wedding", key = "#weddingId")
    public WeddingDto obtainWeddingById(Integer weddingId) {
        int accountId = getAccountId();
        TblWedding tblAccount = tblWeddingRepository.findByIdAndWedAccountAndWedStatus(weddingId, accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND, "No se encontró la boda solicitada o se encuentra inactiva"));
        return WeddingMapper.toDto(tblAccount);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "wedding", key = "#weddingId"),
            @CacheEvict(value = "weddings", key = "#accountId")
    })
    public void deleteWeddingById(int weddingId, int accountId) {
        tblWeddingRepository.findByIdAndWedAccountAndWedStatus(weddingId, accountId, "A")
                .ifPresent((tbl) -> {
                    tbl.setWedStatus("I");
                    tblWeddingRepository.save(tbl);
                });
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "wedding", key = "#wedding.id()"),
            @CacheEvict(value = "weddings", key = "#accountId")
    })
    public void updateWedding(WeddingDto wedding, int accountId) {
        final TblWedding persisted = tblWeddingRepository.findByIdAndWedAccountAndWedStatus(wedding.id(), accountId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "La boda a actualizar no existe"));
        tblWeddingRepository.save(
                WeddingMapper.toUpdate(wedding, persisted));
    }

    @Override
    @Cacheable(value = "weddings", key = "#accountId")
    public List<WeddingDto> obtainAllMyWeddingsByStatus(int accountId, String status) {
        List<TblWedding> myWeddings = tblWeddingRepository.findAllByWedAccountAndWedStatus(accountId, status);
        if (myWeddings.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No hay bodas registradas");
        }
        return myWeddings.stream().map(WeddingMapper::toDto).toList();
    }

    private int getAccountId() {
        return AuthUtil.getCurrentUserId().orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "No se pudo verificar la identidad del usuario"));
    }
}
