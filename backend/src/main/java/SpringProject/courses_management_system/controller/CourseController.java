package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.Course.CourseRequest;
import SpringProject.courses_management_system.dto.Course.CourseResponse;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/courses")

public class CourseController {



   private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    // =========================
    // STUDENT
    // =========================
    @GetMapping("/featured")
    public List<Course> getFeaturedCourses() {
        return courseService.getFeaturedCourses();
    }

    @GetMapping
    public List<Course> getAllCourses(){

        return courseService.getAllCourses();
    }

    // =========================
    // ADMIN
    // =========================
    @GetMapping("/admin")
    public List<CourseResponse> getAllCoursesForAdmin() {
        return courseService.getAllCoursesResponse();
    }


    @PostMapping
    public CourseResponse createCourse(
            @RequestParam String courseName,
            @RequestParam String description,
            @RequestParam String shortDescription,
            @RequestParam BigDecimal courseHours,
            @RequestParam int lectureCount,
            @RequestParam int price,

            @RequestParam List<UUID> categoryIds,

            @RequestPart("contentFile") MultipartFile contentFile,
            @RequestPart("courseImage") MultipartFile courseImage,

            @RequestPart(value = "iconImage", required = false)
            MultipartFile iconImage
    ) {

        return courseService.createCourse(
                courseName,
                description,
                shortDescription,
                courseHours,
                lectureCount,
                price,
                categoryIds,
                contentFile,
                courseImage,
                iconImage
        );
    }


    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    public CourseResponse updateCourse(
            @PathVariable UUID id,
            @RequestBody CourseRequest request) {
        return courseService.updateCourse(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<CourseResponse> getCoursesByCategory(
            @PathVariable UUID categoryId) {

        return courseService.getCoursesByCategory(categoryId);
    }


}
