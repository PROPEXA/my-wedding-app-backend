package org.wedding.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@Table(name = "tbl_languages")
@NoArgsConstructor
@AllArgsConstructor
public class TblLanguage {
    @Id
    @Size(max = 2)
    @SequenceGenerator(name = "tbl_languages_id_gen", sequenceName = "seq_tbl_invitations_detail", allocationSize = 1)
    @Column(name = "iso639_1", nullable = false, length = 2)
    private String iso6391;

    @Size(max = 3)
    @NotNull
    @Column(name = "iso639_2", nullable = false, length = 3)
    private String iso6392;

    @Size(max = 30)
    @NotNull
    @Column(name = "native_name", nullable = false, length = 30)
    private String nativeName;

    @Size(max = 30)
    @NotNull
    @Column(name = "english_name", nullable = false, length = 30)
    private String englishName;

    @Size(max = 10)
    @Column(name = "direction", length = 10)
    private String direction;

    @Size(max = 1)
    @ColumnDefault("'Y'")
    @Column(name = "is_active", length = 1)
    private String isActive;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;


}