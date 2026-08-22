package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Enrollment;
import SpringProject.courses_management_system.model.EnrollmentKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentKey> {
    List<Enrollment> findByUserId(UUID userId);
}
