package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.CourseRegistration.CourseRegistrationRequest;
import SpringProject.courses_management_system.model.CourseRegistration;
import SpringProject.courses_management_system.service.CourseRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/course-registrations")
@RequiredArgsConstructor
public class CourseRegistrationController {

    private final CourseRegistrationService registrationService;


    // =====================================================
    // PUBLIC - CREATE REGISTRATION
    // =====================================================

    @PostMapping
    public ResponseEntity<CourseRegistration> createRegistration(
            @RequestBody CourseRegistrationRequest request
    ) {

        return ResponseEntity.ok(
                registrationService.createRegistration(request)
        );
    }


    // =====================================================
    // ADMIN - GET ALL REGISTRATIONS
    // =====================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseRegistration>>
    getAllRegistrations() {

        return ResponseEntity.ok(
                registrationService.getAllRegistrations()
        );
    }


    // =====================================================
    // ADMIN - GET SINGLE REGISTRATION
    // =====================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseRegistration>
    getRegistration(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                registrationService.getRegistrationById(id)
        );
    }


    // =====================================================
    // ADMIN - TOGGLE CONTACTED
    // =====================================================

    @PatchMapping("/{id}/contacted")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseRegistration>
    toggleContacted(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                registrationService.toggleContacted(id)
        );
    }


    // =====================================================
    // ADMIN - DELETE REGISTRATION
    // =====================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRegistration(
            @PathVariable UUID id
    ) {

        registrationService.deleteRegistration(id);

        return ResponseEntity.noContent().build();
    }
}