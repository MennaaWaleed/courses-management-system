package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.zip.CheckedOutputStream;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    List<Course> findByFeaturedTrueAndPublishedTrueAndIsDeletedFalse();

    List<Course> findByPublishedTrueAndIsDeletedFalse();

    List<Course> findByIsDeletedFalse();

    List<Course> findByCategories_IdAndIsDeletedFalse(UUID categoryId);

    List<Course> findByCategoriesContaining(Category category);


    List<Course> findByFeaturedTrueAndPublishedTrue();
    List<Course> findByPublishedTrue();
    Optional<Course> findByIdAndPublishedTrue(UUID id);


    @Query("""
    SELECT DISTINCT c
    FROM Course c
    JOIN c.categories category
    WHERE category IN (
        SELECT category
        FROM Course currentCourse
        JOIN currentCourse.categories category
        WHERE currentCourse.id = :courseId
    )
    AND c.id <> :courseId
""")
    List<Course> findRelatedCourses(@Param("courseId") UUID courseId);
    Optional<Course> findByIdAndIsDeletedFalse(UUID id);
}
