package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Lecture.LectureResourceResponse;
import SpringProject.courses_management_system.dto.Lecture.LectureResourceUpdateRequest;
import SpringProject.courses_management_system.service.LectureResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lecture-resources")
public class LectureResourceController {

    private final LectureResourceService lectureResourceService;

    public LectureResourceController(
            LectureResourceService lectureResourceService
    ) {
        this.lectureResourceService =
                lectureResourceService;
    }


    // =====================================================
    // GET
    // =====================================================

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<LectureResourceResponse>>
    getResourcesByLecture(
            @PathVariable UUID lectureId
    ) {

        return ResponseEntity.ok(
                lectureResourceService
                        .getResourcesByLecture(lectureId)
        );
    }


    // =====================================================
    // CREATE UPLOAD
    // =====================================================

    @PostMapping(
            value = "/lecture/{lectureId}/upload",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<LectureResourceResponse>
    uploadResource(

            @PathVariable UUID lectureId,

            @RequestParam String name,

            @RequestParam String type,

            @RequestPart("file")
            MultipartFile file
    ) {

        LectureResourceResponse response =
                lectureResourceService
                        .createUploadedResource(
                                lectureId,
                                name,
                                type,
                                file
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // CREATE DRIVE
    // =====================================================

    @PostMapping("/lecture/{lectureId}/drive")
    public ResponseEntity<LectureResourceResponse>
    createDriveResource(

            @PathVariable UUID lectureId,

            @RequestParam String name,

            @RequestParam String type,

            @RequestParam String fileUrl
    ) {

        LectureResourceResponse response =
                lectureResourceService
                        .createDriveResource(
                                lectureId,
                                name,
                                type,
                                fileUrl
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // CREATE EXTERNAL
    // =====================================================

    @PostMapping("/lecture/{lectureId}/external")
    public ResponseEntity<LectureResourceResponse>
    createExternalResource(

            @PathVariable UUID lectureId,

            @RequestParam String name,

            @RequestParam String type,

            @RequestParam String fileUrl
    ) {

        LectureResourceResponse response =
                lectureResourceService
                        .createExternalResource(
                                lectureId,
                                name,
                                type,
                                fileUrl
                        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // UPDATE RESOURCE DATA
    // =====================================================

    @PutMapping("/{resourceId}")
    public ResponseEntity<LectureResourceResponse>
    updateResource(

            @PathVariable UUID resourceId,

            @RequestBody
            LectureResourceUpdateRequest request
    ) {

        return ResponseEntity.ok(
                lectureResourceService
                        .updateResource(
                                resourceId,
                                request
                        )
        );
    }


    // =====================================================
    // REPLACE UPLOADED FILE
    // =====================================================

    @PutMapping(
            value = "/{resourceId}/file",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<LectureResourceResponse>
    replaceUploadedFile(

            @PathVariable UUID resourceId,

            @RequestPart("file")
            MultipartFile file
    ) {

        return ResponseEntity.ok(
                lectureResourceService
                        .replaceUploadedFile(
                                resourceId,
                                file
                        )
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<Void>
    deleteResource(
            @PathVariable UUID resourceId
    ) {

        lectureResourceService
                .deleteResource(resourceId);

        return ResponseEntity
                .noContent()
                .build();
    }
}