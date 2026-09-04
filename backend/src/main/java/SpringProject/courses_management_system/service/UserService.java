package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.ProfileData.AssignedBatchResponse;
import SpringProject.courses_management_system.dto.ProfileData.EnrolledCourseResponse;
import SpringProject.courses_management_system.dto.ProfileData.UserProfileResponse;
import SpringProject.courses_management_system.dto.ProfileData.WishlistCourseResponse;
import SpringProject.courses_management_system.model.Certificate;
import SpringProject.courses_management_system.model.CourseBatch;
import SpringProject.courses_management_system.model.Enrollment;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.model.Wishlist;
import SpringProject.courses_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;
    private final WishlistRepository wishlistRepository;
    private final CourseBatchRepository courseBatchRepository;

    public UserProfileResponse getUserProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UUID userId = user.getId();
        String roleName = user.getRole().name();

        List<EnrolledCourseResponse> enrolledCourses = Collections.emptyList();
        List<WishlistCourseResponse> wishlist = Collections.emptyList();
        List<AssignedBatchResponse> assignedBatches = Collections.emptyList();

        if ("ADMIN".equalsIgnoreCase(roleName)) {
            return new UserProfileResponse(
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    roleName,
                    null,
                    null,
                    null
            );
        }

        if ("INSTRUCTOR".equalsIgnoreCase(roleName)) {
            List<CourseBatch> batches = courseBatchRepository.findByInstructorId(userId);

            assignedBatches = batches.stream()
                    .map(b -> new AssignedBatchResponse(
                            b.getId(),
                            b.getCourse().getCourseName(),
                            b.getBatchName()
                    ))
                    .toList();

            return new UserProfileResponse(
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    roleName,
                    null,
                    null,
                    assignedBatches
            );
        }

        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        enrolledCourses = enrollments.stream()
                .map(enrollment -> {
                    String courseName = enrollment.getCourseBatch().getCourse().getCourseName();
                    String batchName = enrollment.getCourseBatch().getBatchName();
                    UUID batchId = enrollment.getCourseBatch().getId();

                    String rawCertificatePath = certificateRepository
                            .findByStudentIdAndCourseBatchId(userId, batchId)
                            .map(Certificate::getCertificateUrl)
                            .orElse(null);

                    String httpCertificateUrl = null;
                    if (rawCertificatePath != null && !rawCertificatePath.isBlank()) {
                        String fileName = Paths.get(rawCertificatePath.replace("file:///", "")).getFileName().toString();
                        httpCertificateUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/images/courses/Certificates/")
                                .path(fileName)
                                .toUriString();
                    }

                    return new EnrolledCourseResponse(courseName, batchName, httpCertificateUrl,batchId);
                })
                .toList();

        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);
        wishlist = wishlistItems.stream()
                .map(item -> new WishlistCourseResponse(
                        item.getCourse().getId(),
                        item.getCourse().getCourseName(),
                        item.getCourse().getPrice()
                ))
                .toList();

        return new UserProfileResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                roleName,
                enrolledCourses,
                wishlist,
                null
        );
    }
}