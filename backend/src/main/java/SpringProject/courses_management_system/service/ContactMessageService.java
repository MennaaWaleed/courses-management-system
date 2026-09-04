package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Contact.ContactRequest;
import SpringProject.courses_management_system.dto.contact.ContactResponse;
import SpringProject.courses_management_system.model.ContactMessage;
import org.springframework.stereotype.Service;
import SpringProject.courses_management_system.repository.ContactMessageRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ContactMessageService {
    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public ContactResponse sendMessage(ContactRequest request) {

        ContactMessage contactMessage = new ContactMessage();

        contactMessage.setName(request.getName());
        contactMessage.setEmail(request.getEmail());
        contactMessage.setPhone(request.getPhone());
        contactMessage.setMessage(request.getMessage());

        contactMessageRepository.save(contactMessage);

        return new ContactResponse("Message sent successfully.");
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByIsDeletedFalseOrderByCreatedAtDesc();
    }

    public void softDeleteMessage(UUID id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setDeleted(true);
        contactMessageRepository.save(message);
    }

    public ContactMessage toggleContacted(UUID id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setContacted(!message.isContacted());
        return contactMessageRepository.save(message);
    }

}