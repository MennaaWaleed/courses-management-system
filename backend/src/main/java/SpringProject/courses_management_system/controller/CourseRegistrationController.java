package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.CourseRegistration.CourseRegistrationRequest;
import SpringProject.courses_management_system.model.CourseRegistration;
import SpringProject.courses_management_system.service.CourseRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/course-registrations")
public class CourseRegistrationController {

    private final CourseRegistrationService registrationService;

    public CourseRegistrationController(
            CourseRegistrationService registrationService
    ) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<CourseRegistration> createRegistration( @RequestBody CourseRegistrationRequest request) {

        CourseRegistration registration =
                registrationService.createRegistration(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(registration);
    }
}