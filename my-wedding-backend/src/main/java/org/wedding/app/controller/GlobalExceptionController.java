package org.wedding.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.wedding.app.dto.ResponseDto;
import org.wedding.app.exception.ServiceException;

@RestControllerAdvice
public class GlobalExceptionController {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto<?>> exceptionHandlers(Exception exception){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ResponseDto.builder()
                        .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .phrase(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                        .message(exception.getMessage())
                        .content(exception.getStackTrace())
                        .build());
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ResponseDto<?>> serviceExceptionHandler(ServiceException exception){
        return ResponseEntity.status(exception.getStatus())
                .body(ResponseDto.builder()
                        .code(exception.getStatus().value())
                        .phrase(exception.getStatus().getReasonPhrase())
                        .message(exception.getMessage())
                        .build());
    }
}
