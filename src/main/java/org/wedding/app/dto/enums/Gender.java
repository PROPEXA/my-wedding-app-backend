package org.wedding.app.dto.enums;

public enum Gender {

    MALE("M"), FEMALE("F"), OTHER("N");

    private final String code;

    Gender(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static Gender fromCode(String code) {
        for (Gender gender : Gender.values()) {
            if (gender.code.equals(code)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Código de género no válido: " + code);
    }
}
