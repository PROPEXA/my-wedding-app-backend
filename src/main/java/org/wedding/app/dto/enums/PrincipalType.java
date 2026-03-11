package org.wedding.app.dto.enums;

public enum PrincipalType {

    GROOM("G"), BRIDE("B");

    private final String code;

    PrincipalType(String code) {
        this.code = code;
    }
}
