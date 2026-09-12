package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.AdminStudent.AdminStudentDetailsResponse;
import SpringProject.courses_management_system.dto.AdminStudent.AdminStudentResponse;
import SpringProject.courses_management_system.dto.AdminStudent.AvailableBatchResponse;
import SpringProject.courses_management_system.service.AdminStudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    private final AdminStudentService adminStudentService;

    public AdminStudentController(
            AdminStudentService adminStudentService
    ) {
        this.adminStudentService = adminStudentService;
    }


    @GetMapping
    public ResponseEntity<List<AdminStudentResponse>> getAllStudents() {

        return ResponseEntity.ok(
                adminStudentService.getAllStudents()
        );
    }


    @GetMapping("/{studentId}")
    public ResponseEntity<AdminStudentDetailsResponse> getStudentDetails(
            @PathVariable UUID studentId
    ) {

        return ResponseEntity.ok(
                adminStudentService.getStudentDetails(studentId)
        );
    }


    @GetMapping("/{studentId}/courses/{courseId}/batches")
    public ResponseEntity<List<AvailableBatchResponse>> getAvailableBatches(
            @PathVariable UUID studentId,
            @PathVariable UUID courseId
    ) {

        return ResponseEntity.ok(
                adminStudentService.getAvailableBatches(
                        studentId,
                        courseId
                )
        );
    }


    @PutMapping(
            "/{studentId}/enrollments/{currentBatchId}/batch/{newBatchId}"
    )
    public ResponseEntity<String> changeStudentBatch(
            @PathVariable UUID studentId,
            @PathVariable UUID currentBatchId,
            @PathVariable UUID newBatchId
    ) {

        adminStudentService.changeStudentBatch(
                studentId,
                currentBatchId,
                newBatchId
        );

        return ResponseEntity.ok(
                "Student batch changed successfully"
        );
    }


    @DeleteMapping("/{studentId}/enrollments/{batchId}")
    public ResponseEntity<String> removeStudentFromBatch(
            @PathVariable UUID studentId,
            @PathVariable UUID batchId
    ) {

        adminStudentService.removeStudentFromBatch(
                studentId,
                batchId
        );

        return ResponseEntity.ok(
                "Student removed from batch successfully"
        );
    }

    @PutMapping("/{studentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateStudentStatus(
            @PathVariable UUID studentId,
            @RequestParam boolean enabled
    ) {
        adminStudentService.updateStudentEnabled(studentId, enabled);

        return ResponseEntity.ok(
                enabled
                        ? "Student enabled successfully"
                        : "Student disabled successfully"
        );
    }
}