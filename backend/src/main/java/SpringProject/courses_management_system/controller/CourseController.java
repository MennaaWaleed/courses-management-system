package SpringProject.courses_management_system.controller;


import SpringProject.courses_management_system.model.Course;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import SpringProject.courses_management_system.dto.Course.CourseResponse;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")

public class CourseController {



   private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }


    @GetMapping("/featured")
    public List<Course> getFeaturedCourses() {
        return courseService.getFeaturedCourses();
    }

    @GetMapping
    public List<Course> getAllCourses(){

        return courseService.getAllCourses();
    }


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



    @GetMapping("/{id}/related")
    public ResponseEntity<List<Course>> getRelatedCourses(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                courseService.getRelatedCourses(id)
        );
    }


    @GetMapping("/{id}")
    public CourseResponse getCourseById(@PathVariable UUID id) {
        return courseService.getCourseById(id);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
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

            @RequestParam(required = false)
            MultipartFile courseImage,

            @RequestParam(required = false)
            MultipartFile iconImage,

            @RequestParam(required = false)
            MultipartFile contentFile
    ) {

        System.out.println("========== UPDATE COURSE CALLED ==========");
        System.out.println("ID = " + id);
        System.out.println("Course Image = " +
                (courseImage != null ? courseImage.getOriginalFilename() : "null"));
        System.out.println("Icon = " +
                (iconImage != null ? iconImage.getOriginalFilename() : "null"));
        System.out.println("PDF = " +
                (contentFile != null ? contentFile.getOriginalFilename() : "null"));


        return courseService.updateCourse(
                id,
                courseName,
                description,
                shortDescription,
                courseHours,
                lectureCount,
                price,
                categoryIds,
                published,
                featured,
                courseImage,
                iconImage,
                contentFile
        );
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

    @PutMapping("/{id}/publish")
    public CourseResponse togglePublish(@PathVariable UUID id) {
        return courseService.togglePublish(id);
    }

    @PutMapping("/{id}/feature")
    public CourseResponse toggleFeature(@PathVariable UUID id) {
        return courseService.toggleFeature(id);
    }

}
