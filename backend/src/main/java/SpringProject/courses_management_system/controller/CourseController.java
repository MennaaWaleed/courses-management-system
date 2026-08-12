package SpringProject.courses_management_system.controller;


import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
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

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Course>> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<Course>> getRelatedCourses(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                courseService.getRelatedCourses(id)
        );
    }
}
