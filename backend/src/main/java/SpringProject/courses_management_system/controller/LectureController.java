package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Lecture.LectureRequest;
import SpringProject.courses_management_system.dto.Lecture.LectureResponse;
import SpringProject.courses_management_system.dto.Lecture.LectureReorderRequest;
import SpringProject.courses_management_system.model.Lecture;
import SpringProject.courses_management_system.service.LectureAccessService;
import SpringProject.courses_management_system.service.LectureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lectures")
public class LectureController {

    private final LectureService lectureService;
    private final LectureAccessService lectureAccessService;

    public LectureController(
            LectureService lectureService,
            LectureAccessService lectureAccessService
    ) {
        this.lectureService = lectureService;
        this.lectureAccessService = lectureAccessService;
    }


    // =====================================================
    // GET ALL LECTURES BY BATCH
    // ADMIN / INSTRUCTOR
    // =====================================================

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<LectureResponse>> getLecturesByBatch(
            @PathVariable UUID batchId,
            Authentication authentication
    ) {

        // Only ADMIN or the INSTRUCTOR assigned to this batch
        lectureAccessService.requireBatchManagementAccess(
                authentication.getName(),
                batchId
        );

        return ResponseEntity.ok(
                lectureService.getLecturesByBatch(batchId)
        );
    }


    // =====================================================
    // STUDENT - GET PUBLISHED LECTURES
    // =====================================================

    @GetMapping("/batch/{batchId}/published")
    public ResponseEntity<List<LectureResponse>> getPublishedLectures(
            @PathVariable UUID batchId,
            Authentication authentication
    ) {

        // ADMIN -> allowed
        // INSTRUCTOR -> allowed only if assigned to batch
        // STUDENT -> allowed only if enrolled in batch
        lectureAccessService.checkBatchAccess(
                authentication.getName(),
                batchId
        );

        return ResponseEntity.ok(
                lectureService.getPublishedLecturesByBatch(batchId)
        );
    }


    // =====================================================
    // GET SINGLE LECTURE
    // =====================================================

    @GetMapping("/{lectureId}")
    public ResponseEntity<LectureResponse> getLecture(
            @PathVariable UUID lectureId,
            Authentication authentication
    ) {

        /*
         * Checks:
         *
         * ADMIN      -> allowed
         * INSTRUCTOR -> only if assigned to lecture's batch
         * STUDENT    -> only if enrolled in lecture's batch
         */
        lectureAccessService.checkLectureAccess(
                authentication.getName(),
                lectureId
        );

        return ResponseEntity.ok(
                lectureService.getLecture(lectureId)
        );
    }


    // =====================================================
    // CREATE LECTURE
    // ADMIN / INSTRUCTOR
    // =====================================================

    @PostMapping
    public ResponseEntity<LectureResponse> createLecture(
            @RequestBody LectureRequest request,
            Authentication authentication
    ) {

        /*
         * LectureRequest contains batchId.
         *
         * ADMIN:
         *     Can create lecture in any batch.
         *
         * INSTRUCTOR:
         *     Can create lecture only in a batch
         *     assigned to him.
         *
         * STUDENT:
         *     Not allowed.
         */
        lectureAccessService.requireBatchManagementAccess(
                authentication.getName(),
                request.getBatchId()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        lectureService.createLecture(request)
                );
    }


    // =====================================================
    // UPDATE LECTURE
    // ADMIN / INSTRUCTOR
    // =====================================================

    @PutMapping("/{lectureId}")
    public ResponseEntity<LectureResponse> updateLecture(
            @PathVariable UUID lectureId,
            @RequestBody LectureRequest request,
            Authentication authentication
    ) {

        lectureAccessService.requireLectureManagementAccess(
                authentication.getName(),
                lectureId
        );

        return ResponseEntity.ok(
                lectureService.updateLecture(
                        lectureId,
                        request
                )
        );
    }


    // =====================================================
    // PUBLISH LECTURE
    // ADMIN / INSTRUCTOR
    // =====================================================

    @PatchMapping("/{lectureId}/publish")
    public ResponseEntity<LectureResponse> publishLecture(
            @PathVariable UUID lectureId,
            Authentication authentication
    ) {

        lectureAccessService.requireLectureManagementAccess(
                authentication.getName(),
                lectureId
        );

        return ResponseEntity.ok(
                lectureService.publishLecture(
                        lectureId
                )
        );
    }


    // =====================================================
    // UNPUBLISH LECTURE
    // ADMIN / INSTRUCTOR
    // =====================================================

    @PatchMapping("/{lectureId}/unpublish")
    public ResponseEntity<LectureResponse> unpublishLecture(
            @PathVariable UUID lectureId,
            Authentication authentication
    ) {

        lectureAccessService.requireLectureManagementAccess(
                authentication.getName(),
                lectureId
        );

        return ResponseEntity.ok(
                lectureService.unpublishLecture(
                        lectureId
                )
        );
    }


    // =====================================================
    // DELETE LECTURE
    // ADMIN / INSTRUCTOR
    // =====================================================

    @DeleteMapping("/{lectureId}")
    public ResponseEntity<Void> deleteLecture(
            @PathVariable UUID lectureId,
            Authentication authentication
    ) {

        lectureAccessService.requireLectureManagementAccess(
                authentication.getName(),
                lectureId
        );

        lectureService.deleteLecture(lectureId);

        return ResponseEntity.noContent().build();
    }


    // =====================================================
    // REORDER LECTURES
    // ADMIN / INSTRUCTOR
    // =====================================================

    @PatchMapping("/reorder")
    public ResponseEntity<List<LectureResponse>> reorderLectures(
            @RequestBody LectureReorderRequest request,
            Authentication authentication
    ) {

        /*
         * IMPORTANT:
         *
         * The reorder request must contain the batchId.
         *
         * Example:
         *
         * {
         *     "batchId": "....",
         *     "lectureIds": [
         *         "lecture-1",
         *         "lecture-2",
         *         "lecture-3"
         *     ]
         * }
         *
         * ADMIN:
         *     allowed.
         *
         * INSTRUCTOR:
         *     allowed only if assigned to this batch.
         *
         * STUDENT:
         *     forbidden.
         */
        lectureAccessService.requireBatchManagementAccess(
                authentication.getName(),
                request.getBatchId()
        );

        return ResponseEntity.ok(
                lectureService.reorderLectures(request)
        );
    }
}