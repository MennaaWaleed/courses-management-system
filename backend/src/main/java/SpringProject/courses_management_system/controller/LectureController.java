package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Lecture.LectureRequest;
import SpringProject.courses_management_system.dto.Lecture.LectureResponse;
import SpringProject.courses_management_system.service.LectureService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    // =========================
    // GET LECTURES BY BATCH
    // =========================

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<LectureResponse>> getLecturesByBatch(
            @PathVariable UUID batchId
    ) {

        return ResponseEntity.ok(
                lectureService.getLecturesByBatch(batchId)
        );
    }


    // =========================
    // CREATE LECTURE
    // =========================

    @PostMapping
    public ResponseEntity<LectureResponse> createLecture(
            @RequestBody LectureRequest request
    ) {

        LectureResponse response =
                lectureService.createLecture(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}