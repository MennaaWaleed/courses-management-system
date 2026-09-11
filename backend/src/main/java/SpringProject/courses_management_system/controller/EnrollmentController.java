package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.MyCourses.MyCourseResponse;
import SpringProject.courses_management_system.service.EnrollmentService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public List<MyCourseResponse> getMyCourses() {
        return enrollmentService.getMyCourses();
    }
}