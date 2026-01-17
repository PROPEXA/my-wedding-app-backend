package org.wedding.app.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ResponseDto<T> {

    private Integer code;
    private String phrase;
    private String message;
    private String url;
    private T content;

}
