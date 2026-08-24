package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Lecture.LectureResourceResponse;
import SpringProject.courses_management_system.model.Lecture;
import SpringProject.courses_management_system.model.LectureResource;
import SpringProject.courses_management_system.model.enums.ResourceSource;
import SpringProject.courses_management_system.model.enums.ResourceType;
import SpringProject.courses_management_system.repository.LectureRepository;
import SpringProject.courses_management_system.repository.LectureResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class LectureResourceService {

    private final LectureResourceRepository lectureResourceRepository;
    private final LectureRepository lectureRepository;
    private final FileStorageService fileStorageService;

    public LectureResourceService(
            LectureResourceRepository lectureResourceRepository,
            LectureRepository lectureRepository,
            FileStorageService fileStorageService
    ) {
        this.lectureResourceRepository = lectureResourceRepository;
        this.lectureRepository = lectureRepository;
        this.fileStorageService = fileStorageService;
    }


    // =====================================================
    // GET RESOURCES BY LECTURE
    // =====================================================

    public List<LectureResourceResponse> getResourcesByLecture(
            UUID lectureId
    ) {

        // Make sure lecture exists
        lectureRepository.findById(lectureId)
                .orElseThrow(() ->
                        new RuntimeException("Lecture not found")
                );

        return lectureResourceRepository
                .findByLectureIdOrderByCreatedAtAsc(lectureId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =====================================================
    // CREATE UPLOADED RESOURCE
    // =====================================================

    public LectureResourceResponse createUploadedResource(
            UUID lectureId,
            String name,
            String type,
            MultipartFile file
    ) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() ->
                        new RuntimeException("Lecture not found")
                );

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resource file is required");
        }

        ResourceType resourceType;

        try {

            resourceType = ResourceType.valueOf(
                    type.toUpperCase()
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid resource type: " + type
            );
        }


        // Save physical file
        String fileUrl =
                fileStorageService.saveLectureResource(file);


        LectureResource resource = new LectureResource();

        resource.setLecture(lecture);
        resource.setName(name);
        resource.setFileUrl(fileUrl);
        resource.setSize(file.getSize());

        resource.setType(resourceType);

        // Because the file is uploaded to our server
        resource.setSource(ResourceSource.UPLOAD);


        LectureResource savedResource =
                lectureResourceRepository.save(resource);


        return convertToResponse(savedResource);
    }



    public LectureResourceResponse createDriveResource( UUID lectureId, String name,  String type,  String fileUrl) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() ->
                        new RuntimeException("Lecture not found")
                );

        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("Google Drive URL is required");
        }

        if (!fileUrl.contains("drive.google.com")) {
            throw new RuntimeException("Invalid Google Drive URL");
        }

        LectureResource resource = new LectureResource();

        resource.setLecture(lecture);
        resource.setName(name);
        resource.setFileUrl(fileUrl);
        resource.setSize(0L);
        resource.setType(ResourceType.valueOf(type));
        resource.setSource(ResourceSource.DRIVE);

        LectureResource savedResource =
                lectureResourceRepository.save(resource);

        return convertToResponse(savedResource);
    }


    // =====================================================
    // CREATE EXTERNAL LINK RESOURCE
    // =====================================================

    public LectureResourceResponse createExternalResource( UUID lectureId, String name,   String type,   String fileUrl
    ) {

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() ->
                        new RuntimeException("Lecture not found")
                );

        if (name == null || name.isBlank()) {
            throw new RuntimeException("Resource name is required");
        }

        if (fileUrl == null || fileUrl.isBlank()) {
            throw new RuntimeException("Resource URL is required");
        }

        ResourceType resourceType;

        try {
            resourceType = ResourceType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid resource type");
        }

        LectureResource resource = new LectureResource();

        resource.setLecture(lecture);
        resource.setName(name);
        resource.setFileUrl(fileUrl);
        resource.setSize(0L);
        resource.setType(resourceType);
        resource.setSource(ResourceSource.EXTERNAL);

        LectureResource savedResource =
                lectureResourceRepository.save(resource);

        return convertToResponse(savedResource);
    }

    // =====================================================
    // DELETE RESOURCE
    // =====================================================

    public void deleteResource(UUID resourceId) {

        LectureResource resource =
                lectureResourceRepository.findById(resourceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lecture resource not found"
                                )
                        );


        /*
         * Currently we delete the database record.
         *
         * Later we can also delete the physical file
         * when source == UPLOAD.
         */

        lectureResourceRepository.delete(resource);
    }


    // =====================================================
    // CONVERT ENTITY -> RESPONSE
    // =====================================================

    private LectureResourceResponse convertToResponse(
            LectureResource resource
    ) {

        LectureResourceResponse response =
                new LectureResourceResponse();

        response.setId(resource.getId());

        response.setLectureId(
                resource.getLecture().getId()
        );

        response.setName(resource.getName());

        response.setFileUrl(resource.getFileUrl());

        response.setSize(resource.getSize());

        response.setType(
                resource.getType().name()
        );

        response.setSource(
                resource.getSource().name()
        );

        response.setCreatedAt(
                resource.getCreatedAt()
        );

        // =========================
        // DRIVE PREVIEW
        // =========================

        if (resource.getSource() == ResourceSource.DRIVE) {

            response.setPreviewUrl(
                    convertDriveUrlToPreview(
                            resource.getFileUrl()
                    )
            );

        } else {

            response.setPreviewUrl(
                    resource.getFileUrl()
            );
        }

        return response;
    }
    private String convertDriveUrlToPreview(String url) {

        if (url == null || url.isBlank()) {
            return url;
        }

        try {

            String marker = "/file/d/";

            int start = url.indexOf(marker);

            if (start == -1) {
                return url;
            }

            start += marker.length();

            int end = url.indexOf("/", start);

            if (end == -1) {
                end = url.length();
            }

            String fileId =
                    url.substring(start, end);

            return "https://drive.google.com/file/d/"
                    + fileId
                    + "/preview";

        } catch (Exception e) {

            return url;
        }
    }


}