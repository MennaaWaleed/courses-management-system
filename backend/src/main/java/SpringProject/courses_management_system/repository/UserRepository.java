package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Role;
import SpringProject.courses_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleOrderByCreatedAtDesc(Role role);

    // 2. Search instructors by name or email
    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<User> searchInstructors(@Param("role") Role role, @Param("keyword") String keyword);
}