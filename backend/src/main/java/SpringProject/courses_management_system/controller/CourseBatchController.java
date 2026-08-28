package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.CourseBatch.*;
import SpringProject.courses_management_system.model.CourseBatch;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.service.CourseBatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CourseBatchController {

    private final CourseBatchService courseBatchService;

    @GetMapping("/instructors-options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DropdownItem>> getInstructorOptions() {
        return ResponseEntity.ok(courseBatchService.getAllInstructorsDropdown());
    }

    @GetMapping("/{courseId}/batches")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CourseBatchResponse>> getBatchesByCourseId(@PathVariable UUID courseId) {
        return ResponseEntity.ok(courseBatchService.getBatchesByCourseId(courseId));
    }

    @PostMapping("/{courseId}/batches")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseBatchResponse> createBatch(
            @PathVariable UUID courseId,
            @Valid @RequestBody CourseBatchRequest request) {
        return new ResponseEntity<>(courseBatchService.createBatch(courseId, request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{courseId}/soft-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDeleteCourse(@PathVariable UUID courseId) {
        courseBatchService.softDeleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/students/{studentId}/batches/{batchId}/remove")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeStudentFromBatch(
            @PathVariable UUID studentId,
            @PathVariable UUID batchId) {

        courseBatchService.removeStudentFromBatch(studentId, batchId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/batches/{batchId}/soft-delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> softDeleteBatch(@PathVariable UUID batchId) {
        courseBatchService.deleteBatch(batchId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/batches/assignable-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AssignableStudent>> getAssignableStudents() {
        return ResponseEntity.ok(
                courseBatchService.getAssignableStudents()
        );
    }

    @GetMapping("/batches/{batchId}/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BatchStudent>> getStudentsByBatch(@PathVariable UUID batchId) {
        return ResponseEntity.ok(courseBatchService.getStudentsByBatchId(batchId));
    }

    @PostMapping("/batches/{batchId}/students/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignStudent(
            @PathVariable UUID batchId,
            @PathVariable UUID studentId) {

        courseBatchService.assignStudent(batchId, studentId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/batches/{batchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseBatch> getBatchById(@PathVariable UUID batchId) {
        return ResponseEntity.ok(courseBatchService.getBatchById(batchId));
    }

    @PutMapping("/batches/{batchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseBatch> updateBatch(
            @PathVariable UUID batchId,
            @RequestBody CourseBatch batchData) {
        CourseBatch updated = courseBatchService.updateBatch(batchId, batchData);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/batches/{oldBatchId}/students/{studentId}/change-batch/{newBatchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changeStudentBatch(
            @PathVariable UUID oldBatchId,
            @PathVariable UUID studentId,
            @PathVariable UUID newBatchId) {

        courseBatchService.changeStudentBatch(oldBatchId, studentId, newBatchId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("batches/{id}/regenerate-code")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseBatchResponse> regenerateBatchCode(@PathVariable UUID id) {
        CourseBatchResponse updatedBatch = courseBatchService.regenerateBatchCode(id);
        return ResponseEntity.ok(updatedBatch);
    }

}