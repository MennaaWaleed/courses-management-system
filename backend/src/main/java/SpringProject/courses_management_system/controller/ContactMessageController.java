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

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')") // Secures the endpoint for admins only
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        List<ContactMessage> messages = contactMessageService.getAllMessages();
        return ResponseEntity.ok(messages);
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