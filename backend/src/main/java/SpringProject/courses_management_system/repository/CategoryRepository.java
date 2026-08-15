package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByPublishedTrue();
    List<Category> findByIsDeletedFalse();
    List<Category> findByPublishedTrueAndIsDeletedFalse();
}