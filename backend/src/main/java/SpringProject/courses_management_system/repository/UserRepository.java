package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail (String email);
}