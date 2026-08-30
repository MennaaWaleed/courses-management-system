package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.model.CourseBatch;
import SpringProject.courses_management_system.model.Lecture;
import SpringProject.courses_management_system.model.Role;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.model.LectureResource;
import SpringProject.courses_management_system.repository.EnrollmentRepository;
import SpringProject.courses_management_system.repository.LectureRepository;
import SpringProject.courses_management_system.repository.LectureResourceRepository;
import SpringProject.courses_management_system.repository.CourseBatchRepository;
import SpringProject.courses_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LectureAccessService {

    private final UserRepository userRepository;
    private final LectureRepository lectureRepository;
    private final LectureResourceRepository lectureResourceRepository;
    private final CourseBatchRepository courseBatchRepository;
    private final EnrollmentRepository enrollmentRepository;


    // =====================================================
    // CHECK ACCESS TO LECTURE
    // =====================================================

    public void checkLectureAccess(
            String email,
            UUID lectureId
    ) {

        User user = getUser(email);

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() ->
                        new RuntimeException("Lecture not found")
                );

        CourseBatch batch = lecture.getCourseBatch();

        if (batch == null) {
            throw new RuntimeException(
                    "Lecture is not assigned to a batch"
            );
        }

        checkBatchAccess(user, batch);
    }


    // =====================================================
    // CHECK ACCESS TO BATCH
    // =====================================================

    public void checkBatchAccess(
            String email,
            UUID batchId
    ) {

        User user = getUser(email);

        CourseBatch batch = courseBatchRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Batch not found"
                        )
                );

        checkBatchAccess(user, batch);
    }


    // =====================================================
    // MAIN BATCH AUTHORIZATION
    // =====================================================

    public void checkBatchAccess(
            User user,
            CourseBatch batch
    ) {

        // =================================================
        // ADMIN
        // =================================================

        if (user.getRole() == Role.ADMIN) {
            return;
        }


        // =================================================
        // INSTRUCTOR
        // =================================================

        if (user.getRole() == Role.INSTRUCTOR) {

            if (
                    batch.getInstructor() != null
                            &&
                            batch.getInstructor()
                                    .getId()
                                    .equals(user.getId())
            ) {
                return;
            }

            throw new AccessDeniedException(
                    "You do not have access to this batch"
            );
        }


        // =================================================
        // STUDENT
        // =================================================

        if (user.getRole() == Role.STUDENT) {

            boolean enrolled =
                    enrollmentRepository
                            .existsByUserIdAndCourseBatchIdAndRemovedFalse(
                                    user.getId(),
                                    batch.getId()
                            );

            if (!enrolled) {

                throw new AccessDeniedException(
                        "You are not enrolled in this batch"
                );
            }

            return;
        }


        // =================================================
        // UNKNOWN ROLE
        // =================================================

        throw new AccessDeniedException(
                "Access denied"
        );
    }


    // =====================================================
    // LECTURE MANAGEMENT ACCESS
    // ADMIN + ASSIGNED INSTRUCTOR ONLY
    // =====================================================

    public void requireLectureManagementAccess(
            String email,
            UUID lectureId
    ) {

        User user = getUser(email);

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lecture not found"
                        )
                );

        CourseBatch batch = lecture.getCourseBatch();

        if (batch == null) {
            throw new RuntimeException(
                    "Lecture is not assigned to a batch"
            );
        }


        // ADMIN

        if (user.getRole() == Role.ADMIN) {
            return;
        }


        // INSTRUCTOR

        if (user.getRole() == Role.INSTRUCTOR) {

            if (
                    batch.getInstructor() != null
                            &&
                            batch.getInstructor()
                                    .getId()
                                    .equals(user.getId())
            ) {
                return;
            }
        }


        throw new AccessDeniedException(
                "You do not have permission to manage this lecture"
        );
    }


    // =====================================================
    // RESOURCE MANAGEMENT ACCESS
    // ADMIN + ASSIGNED INSTRUCTOR ONLY
    // =====================================================

    public void requireResourceManagementAccess(
            String email,
            UUID resourceId
    ) {

        User user = getUser(email);

        LectureResource resource =
                lectureResourceRepository.findById(resourceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Lecture resource not found"
                                )
                        );

        Lecture lecture = resource.getLecture();

        if (lecture == null) {
            throw new RuntimeException(
                    "Resource is not assigned to a lecture"
            );
        }

        requireLectureManagementAccess(
                email,
                lecture.getId()
        );
    }


    // =====================================================
    // ADMIN OR INSTRUCTOR
    // =====================================================

    public void requireAdminOrInstructor(
            String email
    ) {

        User user = getUser(email);

        if (
                user.getRole() == Role.ADMIN
                        ||
                        user.getRole() == Role.INSTRUCTOR
        ) {
            return;
        }

        throw new AccessDeniedException(
                "Only admin or instructor can perform this action"
        );
    }


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );
    }
    public void requireBatchManagementAccess(
            String email,
            UUID batchId
    ) {

        User user = getUser(email);

        CourseBatch batch =
                courseBatchRepository.findByIdAndDeletedFalse(batchId)
                        .orElseThrow(() ->
                                new RuntimeException("Batch not found")
                        );

        // =========================
        // ADMIN
        // =========================

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        // =========================
        // INSTRUCTOR
        // =========================

        if (user.getRole() == Role.INSTRUCTOR) {

            if (
                    batch.getInstructor() != null
                            &&
                            batch.getInstructor()
                                    .getId()
                                    .equals(user.getId())
            ) {
                return;
            }
        }

        throw new AccessDeniedException(
                "You do not have permission to manage this batch"
        );
    }
}