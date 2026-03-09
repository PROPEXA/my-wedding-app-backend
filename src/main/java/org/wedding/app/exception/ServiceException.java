package org.wedding.app.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class ServiceException extends RuntimeException {

    @Getter
    private final HttpStatus status;

    public ServiceException(HttpStatus httpStatus, String message) {
        super(message);
        this.status = httpStatus;
    }
}
