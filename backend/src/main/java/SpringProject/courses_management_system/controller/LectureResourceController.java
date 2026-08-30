package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Lecture.LectureResourceResponse;
import SpringProject.courses_management_system.dto.Lecture.LectureResourceUpdateRequest;
import SpringProject.courses_management_system.service.LectureAccessService;
import SpringProject.courses_management_system.service.LectureResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lecture-resources")
public class LectureResourceController {

    private final LectureResourceService lectureResourceService;
    private final LectureAccessService lectureAccessService;
    public LectureResourceController(
            LectureResourceService lectureResourceService, LectureAccessService lectureAccessService
    ) {
        this.lectureResourceService =
                lectureResourceService;
        this.lectureAccessService = lectureAccessService;
    }


    // =====================================================
    // GET
    // =====================================================

    @GetMapping("/lecture/{lectureId}")
    public ResponseEntity<List<LectureResourceResponse>>
    getResourcesByLecture(
            @PathVariable UUID lectureId,
            Authentication authentication
    ) {


        lectureAccessService.checkLectureAccess(
                authentication.getName(),
                lectureId
        );
        System.out.println("success ---------------------------------------------------------------------------------------------------------------");
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
            MultipartFile file,

            Authentication authentication
    ) {

        lectureAccessService.checkLectureAccess(
                authentication.getName(),
                lectureId
        );

        lectureAccessService.requireAdminOrInstructor(
                authentication.getName()
        );

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

            @RequestParam String fileUrl,
            Authentication authentication
    ) {
        lectureAccessService.requireLectureManagementAccess(authentication.getName(), lectureId);
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

            @RequestParam String fileUrl,
            Authentication authentication
    ) {

        lectureAccessService.requireLectureManagementAccess(authentication.getName(), lectureId);

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
            LectureResourceUpdateRequest request,
            Authentication authentication
    ) {
        lectureAccessService.requireResourceManagementAccess( authentication.getName(),  resourceId);

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
            MultipartFile file,
            Authentication authentication
    ) {
        lectureAccessService.requireResourceManagementAccess( authentication.getName(),  resourceId);

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
            @PathVariable UUID resourceId,
            Authentication authentication
    ) {
        lectureAccessService.requireResourceManagementAccess( authentication.getName(), resourceId
        );
        lectureResourceService
                .deleteResource(resourceId);

        return ResponseEntity
                .noContent()
                .build();
    }
}