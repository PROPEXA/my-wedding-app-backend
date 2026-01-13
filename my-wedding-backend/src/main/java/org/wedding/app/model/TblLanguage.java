package org.wedding.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_languages")
@EntityListeners(AuditingEntityListener.class)
public class TblLanguage {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "iso639_1", nullable = false, unique = true, length = 2)
    private String iso639_1;

    @Column(name = "iso639_2", nullable = false, unique = true, length = 3)
    private String iso639_2;

    @Column(name = "native_name", nullable = false, unique = true, length = 30)
    private String nativeName;

    @Column(name = "english_name", nullable = false, length = 30)
    private String englishName;

    @Column(name = "direction", nullable = false, length = 10)
    private String direction;

    @Column(name = "is_active", nullable = false, length = 1)
    private String isActive;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
