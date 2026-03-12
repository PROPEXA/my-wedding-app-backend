package org.wedding.app.dto.enums;

public enum PrincipalType {

    GROOM("G"), BRIDE("B");

    private final String code;

    PrincipalType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static PrincipalType fromCode(String code) {
        for (PrincipalType type : PrincipalType.values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Código de tipo de principal: " + code);
    }
}
