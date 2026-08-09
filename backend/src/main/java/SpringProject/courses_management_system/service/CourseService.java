package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.repository.CategoryRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Course> getFeaturedCourses() {




        return courseRepository.findByFeaturedTrueAndPublishedTrue();
    }




    public List<Course> getAllCourses(){

        Optional<Course> course= courseRepository.findById(UUID.fromString("4f7b3d39-a03d-4a96-8106-90ff4044d42e"));



        return courseRepository.findByPublishedTrue();
    }
    }
