package org.wedding.app.service;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wedding.app.dto.PrincipalDto;
import org.wedding.app.dto.group.Post;
import org.wedding.app.exception.ServiceException;
import org.wedding.app.mapper.PrincipalMapper;
import org.wedding.app.model.TblWeddingPrincipal;
import org.wedding.app.repository.TblWeddingPrincipalRepository;
import org.wedding.app.repository.TblWeddingRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrincipalServiceImpl implements PrincipalService {

    private final TblWeddingPrincipalRepository tblWeddingPrincipalRepository;
    private final TblWeddingRepository tblWeddingRepository;
    private final Validator validator;

    @Override
    @CacheEvict(value = "principals", key = "#accountId-#weddingId")
    public void saveNewPrincipals(List<PrincipalDto> principalList, int weddingId, int accountId) {
        validateIfWeddingExists(weddingId, accountId);
        saveNewPrincipals(principalList, weddingId);
    }

    private void validateIfWeddingExists(int weddingId, int accountId) {
        boolean exists = tblWeddingRepository.existsByIdAndWedAccount(weddingId, accountId);
        if (!exists) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "La boda proporcionada no existe");
        }
    }

    @Override
    public void saveNewPrincipals(List<PrincipalDto> principalList, int weddingId) {
        validateNewPrincipals(principalList);
        List<TblWeddingPrincipal> entities = principalList.stream()
                .map(p -> PrincipalMapper.toEntity(weddingId, p))
                .toList();
        tblWeddingPrincipalRepository.saveAll(entities);
    }

    private void validateNewPrincipals(List<PrincipalDto> principals) {
        for (PrincipalDto principal : principals) {
            Set<ConstraintViolation<PrincipalDto>> violations = validator.validate(principal, Post.class);
            if (!violations.isEmpty()) {
                String messages = violations.stream()
                        .map(ConstraintViolation::getMessage)
                        .collect(Collectors.joining(", "));
                throw new ServiceException(HttpStatus.BAD_REQUEST, messages);
            }
        }
    }

    @Override
    @Cacheable(value = "principals", key = "#accountId-#weddingId-#principalId")
    public PrincipalDto obtainPrincipalByWeddingIdAndPrincipalId(int weddingId, int principalId, int accountId) {
        validateIfWeddingExists(weddingId, accountId);
        TblWeddingPrincipal principal = tblWeddingPrincipalRepository.findByIdAndWpWeddingAndWpStatus(principalId, weddingId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "El principal no existe"));
        return PrincipalMapper.toDto(principal, true);
    }

    @Override
    @Cacheable(value = "principals", key = "#accountId-#weddingId")
    public List<PrincipalDto> obtainPrincipalByWeddingId(int weddingId, int accountId) {
        validateIfWeddingExists(weddingId, accountId);
        List<TblWeddingPrincipal> principals = tblWeddingPrincipalRepository.findByWpWeddingAndWpStatus(weddingId, "A");
        if (principals.isEmpty()) {
            throw new ServiceException(HttpStatus.NOT_FOUND, "No se encontraron principales para la boda solicitada");
        }
        return principals.stream()
                .map(p -> PrincipalMapper.toDto(p, true))
                .toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "principals", key = "#accountId-#weddingId")
    public void deletePrincipalByWeddingIdAndPrincipalId(int weddingId, int principalId, int accountId) {
        validateIfWeddingExists(weddingId, accountId);
        TblWeddingPrincipal principal = tblWeddingPrincipalRepository.findByIdAndWpWeddingAndWpStatus(principalId, weddingId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "El principal no existe"));
        tblWeddingPrincipalRepository.delete(principal);
    }

    @Override
    @Caching(
            evict = @CacheEvict(value = "principals", key = "#accountId-#weddingId"),
            put = @CachePut(value = "principals", key = "#accountId-#weddingId-#principalId"))
    public void updatePrincipal(PrincipalDto principal, int weddingId, int principalId, int accountId) {
        validateIfWeddingExists(weddingId, accountId);
        TblWeddingPrincipal principalEntity = tblWeddingPrincipalRepository.findByIdAndWpWeddingAndWpStatus(principalId, weddingId, "A")
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, "El principal no existe"));
        tblWeddingPrincipalRepository.save(PrincipalMapper.toUpdate(principal, principalEntity));
    }
}