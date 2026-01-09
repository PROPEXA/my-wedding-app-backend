package org.wedding.app.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto {
    private Integer code;
    private String phrase;
    private String message;
    private String uri;
}
