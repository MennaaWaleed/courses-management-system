package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.dto.CourseBatch.BatchStudent;
import SpringProject.courses_management_system.model.Enrollment;
import SpringProject.courses_management_system.model.EnrollmentKey;
import SpringProject.courses_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import SpringProject.courses_management_system.dto.CourseBatch.AssignableStudent;
import SpringProject.courses_management_system.model.Role;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentKey> {
    @Query("SELECT e FROM Enrollment e WHERE e.user.id = :userId")
    List<Enrollment> findByUserId(@Param("userId") UUID userId);

    Optional<Enrollment> findByIdUserIdAndIdBatchId(UUID userId, UUID batchId);


    @Modifying
    @Query("""
        UPDATE Enrollment e 
        SET e.removed = true 
        WHERE e.id.userId = :userId AND e.id.batchId = :batchId
    """)
    void removeStudentFromBatch(@Param("userId") UUID userId, @Param("batchId") UUID batchId);

    @Query("""
        SELECT new SpringProject.courses_management_system.dto.CourseBatch.BatchStudent(
            u.id,
            CONCAT(u.firstName, ' ', u.lastName),
            u.email,
            u.phoneNumber,
            b.id,
            b.batchName
        )
        FROM Enrollment e
        JOIN e.user u
        JOIN e.courseBatch b
        WHERE b.id = :batchId AND e.removed = false
    """)
    List<BatchStudent> findStudentsByBatchId(@Param("batchId") UUID batchId);

    @Query("""
    SELECT new SpringProject.courses_management_system.dto.CourseBatch.AssignableStudent(
        u.id,
        CONCAT(u.firstName, ' ', u.lastName),
        u.email
    )
    FROM User u
    WHERE u.role = :role
    AND u.enabled = true
    AND NOT EXISTS (
        SELECT e
        FROM Enrollment e
        WHERE e.user.id = u.id
        AND e.removed = false
    )
    ORDER BY u.firstName ASC, u.lastName ASC
""")
    List<AssignableStudent> findAssignableStudents(
            @Param("role") Role role
    );

    @Modifying
    @Query(value = """ 
        UPDATE enrollment
        SET batch_id = :newBatchId,
        removed = false
        WHERE user_id = :studentId
        AND batch_id = :oldBatchId """, nativeQuery = true)
    int changeStudentBatch(
            @Param("studentId") UUID studentId,
            @Param("oldBatchId") UUID oldBatchId,
            @Param("newBatchId") UUID newBatchId
    );



}
