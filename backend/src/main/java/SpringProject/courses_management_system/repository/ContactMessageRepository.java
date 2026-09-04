package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {

    List<ContactMessage> findAllByIsDeletedFalseOrderByCreatedAtDesc();
}