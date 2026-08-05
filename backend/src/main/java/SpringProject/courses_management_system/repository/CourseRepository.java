package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {


    List<Course> findByFeaturedTrueAndPublishedTrue();
}
