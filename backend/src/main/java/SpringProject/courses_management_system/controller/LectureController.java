package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Lecture.LectureRequest;
import SpringProject.courses_management_system.dto.Lecture.LectureResponse;
import SpringProject.courses_management_system.service.LectureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import SpringProject.courses_management_system.dto.Lecture.LectureReorderRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lectures")
public class LectureController {

    private final LectureService lectureService;

    public LectureController(
            LectureService lectureService
    ) {
        this.lectureService = lectureService;
    }


    // =====================================================
    // ADMIN - GET ALL LECTURES
    // =====================================================

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<LectureResponse>> getLecturesByBatch(
            @PathVariable UUID batchId
    ) {

        return ResponseEntity.ok(
                lectureService.getLecturesByBatch(batchId)
        );
    }


    // =====================================================
    // STUDENT - GET PUBLISHED LECTURES
    // =====================================================

    @GetMapping("/batch/{batchId}/published")
    public ResponseEntity<List<LectureResponse>> getPublishedLectures(
            @PathVariable UUID batchId
    ) {

        return ResponseEntity.ok(
                lectureService.getPublishedLecturesByBatch(batchId)
        );
    }


    // =====================================================
    // GET SINGLE LECTURE
    // =====================================================

    @GetMapping("/{lectureId}")
    public ResponseEntity<LectureResponse> getLecture(
            @PathVariable UUID lectureId
    ) {

        return ResponseEntity.ok(
                lectureService.getLecture(lectureId)
        );
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public ResponseEntity<LectureResponse> createLecture(
            @RequestBody LectureRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        lectureService.createLecture(request)
                );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{lectureId}")
    public ResponseEntity<LectureResponse> updateLecture(
            @PathVariable UUID lectureId,
            @RequestBody LectureRequest request
    ) {

        return ResponseEntity.ok(
                lectureService.updateLecture(
                        lectureId,
                        request
                )
        );
    }


    // =====================================================
    // PUBLISH
    // =====================================================

    @PatchMapping("/{lectureId}/publish")
    public ResponseEntity<LectureResponse> publishLecture(
            @PathVariable UUID lectureId
    ) {

        return ResponseEntity.ok(
                lectureService.publishLecture(
                        lectureId
                )
        );
    }


    // =====================================================
    // UNPUBLISH
    // =====================================================

    @PatchMapping("/{lectureId}/unpublish")
    public ResponseEntity<LectureResponse> unpublishLecture(
            @PathVariable UUID lectureId
    ) {

        return ResponseEntity.ok(
                lectureService.unpublishLecture(
                        lectureId
                )
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{lectureId}")
    public ResponseEntity<Void> deleteLecture(
            @PathVariable UUID lectureId
    ) {

        lectureService.deleteLecture(
                lectureId
        );

        return ResponseEntity.noContent().build();
    }

    // =====================================================
// REORDER LECTURES
// =====================================================

    @PatchMapping("/reorder")
    public ResponseEntity<List<LectureResponse>> reorderLectures(
            @RequestBody LectureReorderRequest request
    ) {

        return ResponseEntity.ok(
                lectureService.reorderLectures(request)
        );
    }
}