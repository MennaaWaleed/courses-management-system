package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.CourseBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseBatchRepository extends JpaRepository<CourseBatch, UUID> {

    List<CourseBatch> findByInstructorIdAndDeletedFalse(UUID instructorId);

    @Query("""
        SELECT b FROM CourseBatch b
        JOIN FETCH b.course c
        LEFT JOIN FETCH b.instructor i
        WHERE c.id = :courseId
        AND b.deleted = false
        ORDER BY b.startDate ASC
    """)
    List<CourseBatch> findBatchesByCourseId(@Param("courseId") UUID courseId);

    @Modifying
    @Query("UPDATE CourseBatch b SET b.deleted = true WHERE b.id = :batchId")
    void softDeleteBatchById(@Param("batchId") UUID batchId);

    List<CourseBatch> findByInstructorId(UUID userId);

    Optional<CourseBatch> findByBatchCode(String batchCode);
    Optional<CourseBatch> findByIdAndDeletedFalse(UUID id);
}