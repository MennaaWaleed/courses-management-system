package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.CourseBatch.CreateEnrollmentRequest;
import SpringProject.courses_management_system.dto.CourseBatch.EnrollmentRequestDto;
import SpringProject.courses_management_system.service.CourseBatchService;
import SpringProject.courses_management_system.service.EnrollmentRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class EnrollmentRequestController {

    private final EnrollmentRequestService enrollmentRequestService;
    private final CourseBatchService courseBatchService;
    // ==========================================
    // STUDENT ENDPOINTS
    // ==========================================

    @PostMapping("/api/enrollment-requests")
    @PreAuthorize("hasRole('STUDENT') or hasRole('USER')")
    public ResponseEntity<EnrollmentRequestDto> createRequest(@RequestBody CreateEnrollmentRequest dto, Principal principal) {
        EnrollmentRequestDto request = enrollmentRequestService.createRequest(principal.getName(), dto.getCourseId(), dto.getBatchCode());
        return ResponseEntity.ok(request);
    }

    @GetMapping("/api/enrollment-requests/my")
    @PreAuthorize("hasRole('STUDENT') or hasRole('USER')")
    public ResponseEntity<List<EnrollmentRequestDto>> getMyRequests(Principal principal) {
        return ResponseEntity.ok(enrollmentRequestService.getMyRequests(principal.getName()));
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    @GetMapping("/api/admin/enrollment-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentRequestDto>> getAllRequests() {
        return ResponseEntity.ok(enrollmentRequestService.getAllRequests());
    }

    @PutMapping("/api/admin/enrollment-requests/{id}/accept")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> acceptRequest(@PathVariable UUID id) {
        enrollmentRequestService.acceptRequest(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/admin/enrollment-requests/{id}/decline")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> declineRequest(@PathVariable UUID id) {
        enrollmentRequestService.declineRequest(id);
        return ResponseEntity.ok().build();
    }


}