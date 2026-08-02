package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
public interface ContactMessageRepository extends JpaRepository<ContactMessage,UUID>{

}