package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.CourseBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseBatchRepository extends JpaRepository<CourseBatch, UUID> {

    List<CourseBatch> findByInstructorId(UUID instructorId);
}