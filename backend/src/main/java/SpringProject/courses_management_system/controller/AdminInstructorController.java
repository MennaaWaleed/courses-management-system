package SpringProject.courses_management_system.controller;


import SpringProject.courses_management_system.dto.User.InstructorCreateRequest;
import SpringProject.courses_management_system.dto.User.InstructorResponse;
import SpringProject.courses_management_system.dto.User.InstructorUpdateRequest;
import SpringProject.courses_management_system.dto.User.PasswordChangeRequest;
import SpringProject.courses_management_system.service.AdminInstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/instructors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Secures all endpoints in this controller
public class AdminInstructorController {

    private final AdminInstructorService adminInstructorService;

    @PostMapping
    public ResponseEntity<InstructorResponse> createInstructor(@RequestBody InstructorCreateRequest request) {
        return ResponseEntity.ok(adminInstructorService.createInstructor(request));
    }

    @GetMapping
    public ResponseEntity<List<InstructorResponse>> getAllInstructors(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminInstructorService.searchInstructors(search));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstructorResponse> updateInstructor(
            @PathVariable UUID id, @RequestBody InstructorUpdateRequest request) {
        return ResponseEntity.ok(adminInstructorService.updateInstructor(id, request));
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable UUID id, @RequestBody PasswordChangeRequest request) {
        adminInstructorService.changePassword(id, request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<InstructorResponse> toggleStatus(@PathVariable UUID id) {
        return ResponseEntity.ok(adminInstructorService.toggleStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable UUID id) {
        adminInstructorService.deleteInstructor(id);
        return ResponseEntity.noContent().build();
    }
}