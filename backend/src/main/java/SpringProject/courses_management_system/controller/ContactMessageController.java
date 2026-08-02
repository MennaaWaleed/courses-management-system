package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Contact.ContactRequest;
import SpringProject.courses_management_system.dto.contact.ContactResponse;
import SpringProject.courses_management_system.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
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