package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.MyCourses.MyCourseResponse;
import SpringProject.courses_management_system.model.*;
import SpringProject.courses_management_system.repository.EnrollmentRepository;
import SpringProject.courses_management_system.repository.UserRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<MyCourseResponse> getMyCourses() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            throw new AccessDeniedException("You must be logged in.");
        }

        String email = authentication.getName();

        System.out.println("JWT EMAIL = " + email);

        User user = userRepository.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        if (user.getRole() != Role.STUDENT) {
            System.out.println("wrong --------------------------------------------------------------------------");
            throw new AccessDeniedException(
                    "Only students can access My Courses."
            );
        }

        List<Enrollment> enrollments =
                enrollmentRepository.findActiveEnrollmentsByUserId(
                        user.getId()
                );

        return enrollments.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private MyCourseResponse mapToResponse(Enrollment enrollment) {

        CourseBatch batch = enrollment.getCourseBatch();
        Course course = batch.getCourse();

        return new MyCourseResponse(
                course.getId(),
                course.getCourseName(),
                course.getDescription(),
                course.getImageUrl(),

                batch.getId(),
                batch.getBatchName(),
                batch.getStatus(),
                batch.getAttendanceType(),
                batch.getStartDate(),
                batch.getEndDate(),
                enrollment.getStatus()
        );
    }
}