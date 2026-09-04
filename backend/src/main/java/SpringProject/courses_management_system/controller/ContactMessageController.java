package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Contact.ContactRequest;
import SpringProject.courses_management_system.dto.contact.ContactResponse;
import SpringProject.courses_management_system.model.ContactMessage;
import SpringProject.courses_management_system.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactMessageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) {
        contactMessageService.softDeleteMessage(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/{id}/contacted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactMessage> toggleContacted(@PathVariable UUID id) {
        return ResponseEntity.ok(contactMessageService.toggleContacted(id));
    }

    @PostMapping
    public ResponseEntity<ContactResponse> sendMessage(
            @Valid @RequestBody ContactRequest request) {

        System.out.println("===== CONTACT CONTROLLER REACHED =====");

        ContactResponse response =
                contactMessageService.sendMessage(request);

        return ResponseEntity.ok(response);
    }
}