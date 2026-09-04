package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.CourseRegistration.CourseRegistrationRequest;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.model.CourseRegistration;
import SpringProject.courses_management_system.repository.CourseRegistrationRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CourseRegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final CourseRepository courseRepository;

    public CourseRegistrationService(
            CourseRegistrationRepository registrationRepository,
            CourseRepository courseRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.courseRepository = courseRepository;
    }


    // =====================================================
    // CREATE
    // =====================================================

    public CourseRegistration createRegistration(
            CourseRegistrationRequest request
    ) {

        Course course = courseRepository
                .findById(request.getCourseId())
                .orElseThrow(() ->
                        new RuntimeException("Course not found")
                );

        CourseRegistration registration =
                new CourseRegistration();

        registration.setFullName(request.getFullName());
        registration.setPhone(request.getPhone());
        registration.setEmail(request.getEmail());
        registration.setMessage(request.getMessage());
        registration.setCourse(course);

        // Registration status
        registration.setContacted(false);

        // Soft delete
        registration.setDeleted(false);

        // لو status القديم لسه موجود في الـ Entity
        registration.setStatus("NEW");

        return registrationRepository.save(registration);
    }


    // =====================================================
    // ADMIN - GET ALL
    // =====================================================

    public List<CourseRegistration> getAllRegistrations() {

        return registrationRepository
                .findAllByIsDeletedFalse();
    }


    // =====================================================
    // ADMIN - GET ONE
    // =====================================================

    public CourseRegistration getRegistrationById(
            UUID id
    ) {

        return registrationRepository
                .findByIdAndIsDeletedFalse(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Registration not found"
                        )
                );
    }


    // =====================================================
    // ADMIN - TOGGLE CONTACTED STATUS
    // =====================================================

    public CourseRegistration toggleContacted(
            UUID id
    ) {

        CourseRegistration registration =
                registrationRepository
                        .findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found"
                                )
                        );

        registration.setContacted(
                !registration.isContacted()
        );

        return registrationRepository.save(
                registration
        );
    }


    // =====================================================
    // ADMIN - SOFT DELETE
    // =====================================================

    public void deleteRegistration(
            UUID id
    ) {

        CourseRegistration registration =
                registrationRepository
                        .findByIdAndIsDeletedFalse(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Registration not found"
                                )
                        );

        registration.setDeleted(true);

        registrationRepository.save(
                registration
        );
    }
}