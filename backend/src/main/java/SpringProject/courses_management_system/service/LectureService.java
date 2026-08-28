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
import SpringProject.courses_management_system.dto.Lecture.LectureReorderRequest;
import org.springframework.transaction.annotation.Transactional;
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


    // =====================================================
    // ADMIN - GET ALL LECTURES
    // =====================================================

    public List<LectureResponse> getLecturesByBatch(UUID batchId) {

        courseBatchRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Course batch not found")
                );

        return lectureRepository
                .findByCourseBatchIdOrderByLectureOrderAsc(batchId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =====================================================
    // STUDENT - GET PUBLISHED LECTURES ONLY
    // =====================================================

    public List<LectureResponse> getPublishedLecturesByBatch(
            UUID batchId
    ) {

        courseBatchRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Course batch not found")
                );

        return lectureRepository
                .findByCourseBatchIdAndPublishedTrueOrderByLectureOrderAsc(
                        batchId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =====================================================
    // GET SINGLE LECTURE
    // =====================================================

    public LectureResponse getLecture(UUID lectureId) {

        Lecture lecture =
                lectureRepository.findById(lectureId)
                        .orElseThrow(() ->
                                new RuntimeException("Lecture not found")
                        );

        return convertToResponse(lecture);
    }


    // =====================================================
    // CREATE LECTURE
    // =====================================================

    public LectureResponse createLecture(
            LectureRequest request
    ) {

        CourseBatch courseBatch =
                courseBatchRepository.findById(
                        request.getBatchId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Course batch not found"
                        )
                );


        checkLectureOrderExists(
                request.getBatchId(),
                request.getLectureOrder(),
                null
        );


        Lecture lecture = new Lecture();

        lecture.setCourseBatch(courseBatch);
        lecture.setLectureOrder(
                request.getLectureOrder()
        );
        lecture.setTitle(
                request.getTitle()
        );

        // Admin can explicitly choose published/unpublished
        lecture.setPublished(
                request.isPublished()
        );


        Lecture savedLecture =
                lectureRepository.save(lecture);

        return convertToResponse(savedLecture);
    }


    // =====================================================
    // UPDATE LECTURE
    // =====================================================

    public LectureResponse updateLecture(
            UUID lectureId,
            LectureRequest request
    ) {

        Lecture lecture =
                lectureRepository.findById(lectureId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lecture not found"
                                )
                        );


        // Make sure batch exists
        CourseBatch courseBatch =
                courseBatchRepository.findById(
                        request.getBatchId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Course batch not found"
                        )
                );


        checkLectureOrderExists(
                request.getBatchId(),
                request.getLectureOrder(),
                lectureId
        );


        lecture.setCourseBatch(courseBatch);

        lecture.setLectureOrder(
                request.getLectureOrder()
        );

        lecture.setTitle(
                request.getTitle()
        );

        lecture.setPublished(
                request.isPublished()
        );


        Lecture updatedLecture =
                lectureRepository.save(lecture);

        return convertToResponse(updatedLecture);
    }


    // =====================================================
    // PUBLISH
    // =====================================================

    public LectureResponse publishLecture(
            UUID lectureId
    ) {

        Lecture lecture =
                lectureRepository.findById(lectureId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lecture not found"
                                )
                        );

        lecture.setPublished(true);

        Lecture saved =
                lectureRepository.save(lecture);

        return convertToResponse(saved);
    }


    // =====================================================
    // UNPUBLISH
    // =====================================================

    public LectureResponse unpublishLecture(
            UUID lectureId
    ) {

        Lecture lecture =
                lectureRepository.findById(lectureId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lecture not found"
                                )
                        );

        lecture.setPublished(false);

        Lecture saved =
                lectureRepository.save(lecture);

        return convertToResponse(saved);
    }


    // =====================================================
    // DELETE LECTURE
    // =====================================================

    public void deleteLecture(
            UUID lectureId
    ) {

        Lecture lecture =
                lectureRepository.findById(lectureId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lecture not found"
                                )
                        );

        lectureRepository.delete(lecture);
    }


    // =====================================================
    // CHECK DUPLICATE ORDER
    // =====================================================

    private void checkLectureOrderExists(
            UUID batchId,
            int lectureOrder,
            UUID currentLectureId
    ) {

        List<Lecture> lectures =
                lectureRepository
                        .findByCourseBatchIdOrderByLectureOrderAsc(
                                batchId
                        );


        boolean exists =
                lectures.stream()
                        .anyMatch(lecture ->

                                lecture.getLectureOrder()
                                        == lectureOrder

                                        &&

                                        (
                                                currentLectureId == null
                                                        ||
                                                        !lecture.getId()
                                                                .equals(currentLectureId)
                                        )
                        );


        if (exists) {

            throw new RuntimeException(
                    "Lecture order already exists in this batch"
            );
        }
    }


    // =====================================================
    // CONVERT LECTURE -> RESPONSE
    // =====================================================

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


        if (lecture.getResources() != null) {

            response.setResources(
                    lecture.getResources()
                            .stream()
                            .map(
                                    this::convertResourceToResponse
                            )
                            .toList()
            );

        } else {

            response.setResources(
                    List.of()
            );
        }


        return response;
    }


    // =====================================================
    // CONVERT RESOURCE -> RESPONSE
    // =====================================================

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


    // =====================================================
    // DRIVE PREVIEW
    // =====================================================

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

    // =====================================================
// REORDER LECTURES
// =====================================================

    @Transactional
    public List<LectureResponse> reorderLectures(
            LectureReorderRequest request
    ) {

        UUID batchId = request.getBatchId();

        List<UUID> lectureIds = request.getLectureIds();


        // =========================
        // VALIDATE BATCH
        // =========================

        CourseBatch courseBatch =
                courseBatchRepository.findById(batchId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course batch not found"
                                )
                        );


        // =========================
        // VALIDATE REQUEST
        // =========================

        if (lectureIds == null || lectureIds.isEmpty()) {

            throw new RuntimeException(
                    "Lecture IDs are required"
            );
        }


        // =========================
        // GET EXISTING LECTURES
        // =========================

        List<Lecture> lectures =
                lectureRepository
                        .findByCourseBatchIdOrderByLectureOrderAsc(
                                batchId
                        );


        // =========================
        // SAME NUMBER OF LECTURES
        // =========================

        if (lectures.size() != lectureIds.size()) {

            throw new RuntimeException(
                    "All lectures in the batch must be included"
            );
        }


        // =========================
        // CHECK DUPLICATES
        // =========================

        if (lectureIds.stream().distinct().count()
                != lectureIds.size()) {

            throw new RuntimeException(
                    "Duplicate lecture IDs are not allowed"
            );
        }


        // =========================
        // MAKE SURE ALL LECTURES
        // BELONG TO THIS BATCH
        // =========================

        var existingIds =
                lectures.stream()
                        .map(Lecture::getId)
                        .collect(
                                java.util.stream.Collectors.toSet()
                        );


        if (!existingIds.equals(
                new java.util.HashSet<>(lectureIds)
        )) {

            throw new RuntimeException(
                    "Lecture IDs must belong to the specified batch"
            );
        }


        // =====================================================
        // TEMPORARY ORDERS
        // =====================================================
        //
        // Because of the UNIQUE constraint:
        //
        // batch_id + lecture_order
        //
        // We cannot directly swap orders.
        //
        // First move all lectures to temporary
        // negative orders.
        // =====================================================

        int tempOrder = -1;

        for (Lecture lecture : lectures) {

            lecture.setLectureOrder(tempOrder);

            tempOrder--;
        }

        lectureRepository.saveAll(lectures);


        // =========================
        // APPLY NEW ORDER
        // =========================

        for (int i = 0; i < lectureIds.size(); i++) {

            UUID lectureId =
                    lectureIds.get(i);

            int newOrder =
                    i + 1;


            Lecture lecture =
                    lectures.stream()
                            .filter(
                                    l ->
                                            l.getId()
                                                    .equals(lectureId)
                            )
                            .findFirst()
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Lecture not found"
                                    )
                            );


            lecture.setLectureOrder(newOrder);
        }


        lectureRepository.saveAll(lectures);


        // =========================
        // RETURN UPDATED LECTURES
        // =========================

        return lectureRepository
                .findByCourseBatchIdOrderByLectureOrderAsc(
                        batchId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }
}