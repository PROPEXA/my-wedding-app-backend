package org.wedding.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.wedding.app.model.TblInvitation;
import java.util.Optional;

@Repository
public interface TblInvitationRepository extends JpaRepository<TblInvitation, Integer> {

    /**
     * Retrieves an optional {@code TblInvitation} based on its unique identifier and the identifier
     * of the user who created it.
     *
     * @param id        the unique identifier of the invitation (inv_id).
     * @param createdBy the identifier of the user who created the invitation (inv_created_by).
     * @return an {@code Optional} containing the {@code TblInvitation} if found, or an empty {@code Optional}
     * if no matching invitation is found.
     */
    Optional<TblInvitation> findByIdAndInvCreatedBy(int id, int createdBy);

    /**
     * Retrieves an optional {@code TblInvitation} based on its unique identifier and UUID.
     *
     * @param id   the unique identifier of the invitation (inv_id).
     * @param uuid the unique UUID associated with the invitation (inv_uuid).
     * @return an {@code Optional} containing the {@code TblInvitation} if found, or an empty {@code Optional}
     * if no matching invitation is found.
     */
    Optional<TblInvitation> findByIdAndInvUuid(int id, String uuid);

    /**
     * Checks whether a {@code TblInvitation} exists based on its unique identifier and UUID.
     *
     * @param id   the unique identifier of the invitation (inv_id).
     * @param uuid the unique UUID associated with the invitation (inv_uuid).
     * @return {@code true} if a {@code TblInvitation} exists matching the specified {@code id}
     * and {@code uuid}, otherwise {@code false}.
     */
    boolean existsByIdAndInvUuid(int id, String uuid);

}
