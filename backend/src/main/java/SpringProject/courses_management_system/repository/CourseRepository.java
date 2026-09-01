package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {

    // ==========================================
    // ADMIN / INTERNAL QUERIES
    // ==========================================

    List<Course> findByIsDeletedFalse();

    Optional<Course> findByIdAndIsDeletedFalse(UUID id);


    // ==========================================
    // STUDENT VISIBILITY QUERIES
    // ==========================================

    @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat " +
            "WHERE c.published = true AND c.isDeleted = false " +
            "AND cat.published = true AND cat.isDeleted = false")
    List<Course> findAllStudentVisibleCourses();

    @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat " +
            "WHERE c.featured = true AND c.published = true AND c.isDeleted = false " +
            "AND cat.published = true AND cat.isDeleted = false")
    List<Course> findStudentFeaturedCourses();

    @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat " +
            "WHERE c.id = :id AND c.published = true AND c.isDeleted = false " +
            "AND cat.published = true AND cat.isDeleted = false")
    Optional<Course> findStudentCourseById(@Param("id") UUID id);

    @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat " +
            "WHERE c.published = true AND c.isDeleted = false " +
            "AND cat.id = :categoryId AND cat.published = true AND cat.isDeleted = false")
    List<Course> findStudentCoursesByCategoryId(@Param("categoryId") UUID categoryId);

    @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat " +
            "WHERE c.id != :courseId AND c.published = true AND c.isDeleted = false " +
            "AND cat.published = true AND cat.isDeleted = false " +
            "AND cat IN (SELECT sourceCat FROM Course source JOIN source.categories sourceCat " +
            "            WHERE source.id = :courseId AND source.published = true AND source.isDeleted = false " +
            "            AND sourceCat.published = true AND sourceCat.isDeleted = false)")
    List<Course> findStudentRelatedCourses(@Param("courseId") UUID courseId);


    @Modifying
    @Query("UPDATE Course c SET c.isDeleted = true WHERE c.id = :id")
    void softDeleteById(UUID courseId);

    // ==========================================
    // ADMIN / INTERNAL QUERIES
    // ==========================================



    // ADD THIS NEW METHOD
    @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat " +
            "WHERE cat.id = :categoryId AND c.isDeleted = false")
    List<Course> findAdminCoursesByCategoryId(@Param("categoryId") UUID categoryId);
}