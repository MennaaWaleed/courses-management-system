package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.CourseRegistration.CourseRegistrationRequest;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.model.CourseRegistration;
import SpringProject.courses_management_system.repository.CourseRegistrationRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import org.springframework.stereotype.Service;

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
        registration.setStatus("NEW");

        return registrationRepository.save(registration);
    }
}