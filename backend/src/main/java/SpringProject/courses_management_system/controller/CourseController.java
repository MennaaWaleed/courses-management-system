package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.service.CourseService;
import SpringProject.courses_management_system.dto.Course.CourseResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // ==================================================
    // STUDENT ENDPOINTS
    // ==================================================

    @GetMapping("/featured")
    public List<CourseResponse> getFeaturedCourses() {
        return courseService.getFeaturedCourses();
    }

    @GetMapping
    public List<CourseResponse> getAllCourses(){
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable UUID id) {
        // Enforces strict student visibility rules
        return courseService.getStudentCourseById(id);
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<CourseResponse>> getRelatedCourses(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getRelatedCourses(id));
    }

    @GetMapping("/category/{categoryId}")
    public List<CourseResponse> getCoursesByCategory(@PathVariable UUID categoryId) {
        return courseService.getCoursesByCategory(categoryId);
    }

    // ==================================================
    // ADMIN ENDPOINTS
    // ==================================================

    @GetMapping("/admin")
    public List<CourseResponse> getAllCoursesForAdmin() {
        return courseService.getAllCoursesResponse();
    }

    @GetMapping("/admin/{id}")
    public CourseResponse getAdminCourseById(@PathVariable UUID id) {
        // Skips student visibility rules, allowing Admin to fetch soft-deleted/unpublished courses
        return courseService.getAdminCourseById(id);
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
            @RequestPart(value = "iconImage", required = false) MultipartFile iconImage
    ) {
        return courseService.createCourse(
                courseName, description, shortDescription, courseHours,
                lectureCount, price, categoryIds, contentFile, courseImage, iconImage
        );
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CourseResponse updateCourse(
            @PathVariable UUID id,
            @RequestParam String courseName,
            @RequestParam String description,
            @RequestParam String shortDescription,
            @RequestParam BigDecimal courseHours,
            @RequestParam int lectureCount,
            @RequestParam int price,
            @RequestParam List<UUID> categoryIds,
            @RequestParam boolean published,
            @RequestParam boolean featured,
            @RequestParam(required = false) MultipartFile courseImage,
            @RequestParam(required = false) MultipartFile iconImage,
            @RequestParam(required = false) MultipartFile contentFile
    ) {
        return courseService.updateCourse(
                id, courseName, description, shortDescription, courseHours,
                lectureCount, price, categoryIds, published, featured,
                courseImage, iconImage, contentFile
        );
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
    }

    @PutMapping("/{id}/publish")
    public CourseResponse togglePublish(@PathVariable UUID id) {
        return courseService.togglePublish(id);
    }

    @PutMapping("/{id}/feature")
    public CourseResponse toggleFeature(@PathVariable UUID id) {
        return courseService.toggleFeature(id);
    }

    @GetMapping("/admin/category/{categoryId}")
    public List<CourseResponse> getAdminCoursesByCategory(@PathVariable UUID categoryId) {
        return courseService.getAdminCoursesByCategory(categoryId);
    }
}