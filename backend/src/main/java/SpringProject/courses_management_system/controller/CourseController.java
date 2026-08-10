package SpringProject.courses_management_system.controller;


import SpringProject.courses_management_system.dto.Course.CourseRequest;
import SpringProject.courses_management_system.dto.Course.CourseResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    private List<Course> getAllCourses(){

        return courseService.getAllCourses();
    }

    @PostMapping
    private CourseResponse createCourse(@RequestBody CourseRequest courseRequest){
        return courseService.createCourse(courseRequest);
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
}
