package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, UUID> {

    List<CourseRegistration> findByCourseId(UUID courseId);

    List<CourseRegistration> findByStatus(String status);
    List<CourseRegistration> findAllByIsDeletedFalse();

    Optional<CourseRegistration> findByIdAndIsDeletedFalse(
            UUID id
    );
}