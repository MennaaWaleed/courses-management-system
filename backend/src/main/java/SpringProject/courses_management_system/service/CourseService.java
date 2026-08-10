package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Course.CourseRequest;
import SpringProject.courses_management_system.dto.Course.CourseResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.repository.CategoryRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.*;

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
    private CourseResponse convertToResponse(Course course) {

        CourseResponse response = new CourseResponse();

        response.setId(course.getId());
        response.setCourseName(course.getCourseName());
        response.setDescription(course.getDescription());
        response.setShortDescription(course.getShortDescription());

        response.setPublished(course.isPublished());
        response.setCourseHours(course.getCourseHours());
        response.setLectureCount(course.getLectureCount());

        response.setImageUrl(course.getImageUrl());
        response.setIconUrl(course.getIconUrl());

        response.setPrice(course.getPrice());
        response.setFeatured(course.isFeatured());

        response.setContent_url(course.getContent_url());

        return response;
    }

    public CourseResponse createCourse(CourseRequest courseRequest) {
        Course course = new Course();
        course.setCourseName(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());
        course.setShortDescription(courseRequest.getShortDescription());

        course.setPublished(courseRequest.isPublished());
        course.setCourseHours(courseRequest.getCourseHours());
        course.setLectureCount(courseRequest.getLectureCount());

        course.setImageUrl(courseRequest.getImageUrl());
        course.setIconUrl(courseRequest.getIconUrl());

        course.setPrice(courseRequest.getPrice());
        course.setFeatured(courseRequest.isFeatured());

        List<Category> categories =
                categoryRepository.findAllById(courseRequest.getCategoryIds());

        course.setCategories(new HashSet<>(categories));
        course.setContent_url(courseRequest.getContent_url());
        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }

    public CourseResponse getCourseById(UUID id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return convertToResponse(course);
    }

    public CourseResponse updateCourse(UUID id, CourseRequest request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setShortDescription(request.getShortDescription());

        course.setPublished(request.isPublished());
        course.setCourseHours(request.getCourseHours());
        course.setLectureCount(request.getLectureCount());

        course.setImageUrl(request.getImageUrl());
        course.setIconUrl(request.getIconUrl());
        course.setContent_url(request.getContent_url());

        course.setPrice(request.getPrice());
        course.setFeatured(request.isFeatured());

        List<Category> categories =
                categoryRepository.findAllById(request.getCategoryIds());

        course.setCategories(new HashSet<>(categories));

        Course updatedCourse = courseRepository.save(course);

        return convertToResponse(updatedCourse);
    }

    public void deleteCourse(UUID id) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        courseRepository.delete(course);
    }
}
