package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Lecture.LectureRequest;
import SpringProject.courses_management_system.dto.Lecture.LectureResourceResponse;
import SpringProject.courses_management_system.dto.Lecture.LectureResponse;
import SpringProject.courses_management_system.model.CourseBatch;
import SpringProject.courses_management_system.model.Lecture;
import SpringProject.courses_management_system.model.LectureResource;
import SpringProject.courses_management_system.model.enums.ResourceSource;
import SpringProject.courses_management_system.repository.CourseBatchRepository;
import SpringProject.courses_management_system.repository.LectureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LectureService {

    private final LectureRepository lectureRepository;
    private final CourseBatchRepository courseBatchRepository;

    public LectureService(
            LectureRepository lectureRepository,
            CourseBatchRepository courseBatchRepository
    ) {
        this.lectureRepository = lectureRepository;
        this.courseBatchRepository = courseBatchRepository;
    }


    // =========================
    // GET LECTURES BY BATCH
    // =========================

    public List<LectureResponse> getLecturesByBatch(UUID batchId) {

        courseBatchRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Course batch not found")
                );

        List<Lecture> lectures =
                lectureRepository
                        .findByCourseBatchIdOrderByLectureOrderAsc(batchId);

        return lectures.stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================
    // CREATE LECTURE
    // =========================

    public LectureResponse createLecture(
            LectureRequest request
    ) {

        CourseBatch courseBatch =
                courseBatchRepository.findById(request.getBatchId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course batch not found"
                                )
                        );


        // Check duplicate lecture order

        List<Lecture> existingLectures =
                lectureRepository
                        .findByCourseBatchIdOrderByLectureOrderAsc(
                                request.getBatchId()
                        );

        boolean orderExists =
                existingLectures.stream()
                        .anyMatch(
                                lecture ->
                                        lecture.getLectureOrder()
                                                == request.getLectureOrder()
                        );

        if (orderExists) {

            throw new RuntimeException(
                    "Lecture order already exists in this batch"
            );
        }


        Lecture lecture = new Lecture();

        lecture.setCourseBatch(courseBatch);
        lecture.setLectureOrder(request.getLectureOrder());
        lecture.setTitle(request.getTitle());

        // New lectures are unpublished by default
        lecture.setPublished(false);


        Lecture savedLecture =
                lectureRepository.save(lecture);

        return convertToResponse(savedLecture);
    }


    // =========================
    // CONVERT LECTURE TO RESPONSE
    // =========================

    private LectureResponse convertToResponse(
            Lecture lecture
    ) {

        LectureResponse response =
                new LectureResponse();

        response.setId(
                lecture.getId()
        );

        response.setBatchId(
                lecture.getCourseBatch().getId()
        );

        response.setLectureOrder(
                lecture.getLectureOrder()
        );

        response.setTitle(
                lecture.getTitle()
        );

        response.setPublished(
                lecture.isPublished()
        );


        // =========================
        // RESOURCES
        // =========================

        if (lecture.getResources() != null) {

            List<LectureResourceResponse> resources =
                    lecture.getResources()
                            .stream()
                            .map(this::convertResourceToResponse)
                            .toList();

            response.setResources(resources);

        } else {

            response.setResources(
                    List.of()
            );
        }


        return response;
    }


    // =========================
    // CONVERT RESOURCE TO RESPONSE
    // =========================

    private LectureResourceResponse convertResourceToResponse(
            LectureResource resource
    ) {

        LectureResourceResponse response =
                new LectureResourceResponse();

        response.setId(
                resource.getId()
        );

        response.setLectureId(
                resource.getLecture().getId()
        );

        response.setName(
                resource.getName()
        );

        response.setFileUrl(
                resource.getFileUrl()
        );

        response.setSize(
                resource.getSize()
        );

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
        // PREVIEW URL
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


    // =========================
    // DRIVE PREVIEW URL
    // =========================

    private String convertDriveUrlToPreview(
            String url
    ) {

        if (url == null || url.isBlank()) {
            return url;
        }

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
    }
}