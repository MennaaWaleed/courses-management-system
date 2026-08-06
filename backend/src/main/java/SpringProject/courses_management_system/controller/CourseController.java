package SpringProject.courses_management_system.controller;


import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.service.CourseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
