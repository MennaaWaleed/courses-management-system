package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Course.CourseRequest;
import SpringProject.courses_management_system.dto.Course.CourseResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.repository.CategoryRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.math.BigDecimal;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Course> getFeaturedCourses() {
        return courseRepository.findByFeaturedTrueAndPublishedTrueAndIsDeletedFalse();
    }

    //for Student page
    public List<Course> getAllCourses(){
        return courseRepository.findByPublishedTrueAndIsDeletedFalse();
    }

    // for Admin
    public List<CourseResponse> getAllCoursesResponse() {

        List<Course> courses = courseRepository.findByIsDeletedFalse();

        return courses.stream()
                .map(this::convertToResponse)
                .toList();
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

    public CourseResponse createCourse(
            String courseName,
            String description,
            String shortDescription,
            BigDecimal courseHours,
            int lectureCount,
            int price,
            List<UUID> categoryIds,
            MultipartFile contentFile,
            MultipartFile courseImage,
            MultipartFile iconImage
    ) {

        try {

            Course course = new Course();


            course.setCourseName(courseName);
            course.setDescription(description);
            course.setShortDescription(shortDescription);

            course.setCourseHours(courseHours);
            course.setLectureCount(lectureCount);
            course.setPrice(price);

            course.setPublished(false);

            course.setFeatured(false);

            course.setDeleted(false);

            List<Category> categories =
                    categoryRepository.findAllById(categoryIds);

            if (categories.size() != categoryIds.size()) {
                throw new RuntimeException("One or more categories not found");
            }

            course.setCategories(
                    new HashSet<>(categories)
            );


            if (contentFile == null || contentFile.isEmpty()) {
                throw new RuntimeException("Course PDF is required");
            }

            String contentUrl = saveFile(
                    contentFile,
                    "courses/CoursesContent"
            );

            course.setContent_url(contentUrl);


            if (courseImage == null || courseImage.isEmpty()) {
                throw new RuntimeException("Course image is required");
            }

            String imageUrl = saveFile(
                    courseImage,
                    "courses/images"
            );

            course.setImageUrl(imageUrl);

            if (iconImage != null && !iconImage.isEmpty()) {

                String iconUrl = saveFile(
                        iconImage,
                        "courses/icons"
                );

                course.setIconUrl(iconUrl);

            }

            Course savedCourse =
                    courseRepository.save(course);

            return convertToResponse(savedCourse);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save course files",
                    e
            );
        }
    }

    public CourseResponse getCourseById(UUID id) {

        Course course = courseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return convertToResponse(course);
    }

    public CourseResponse updateCourse(UUID id, CourseRequest request) {

        Course course = courseRepository.findByIdAndIsDeletedFalse(id)
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

        Course course = courseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setDeleted(true);

        courseRepository.save(course);
    }

    public List<CourseResponse> getCoursesByCategory(UUID categoryId) {

        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        List<Course> courses =
                courseRepository.findByCategories_IdAndIsDeletedFalse(categoryId);

        return courses.stream()
                .map(this::convertToResponse)
                .toList();
    }

    private String saveFile(
            MultipartFile file,
            String folder
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFileName = file.getOriginalFilename();
        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(
                    originalFileName.lastIndexOf(".")
            );
        }

        String fileName = UUID.randomUUID() + extension;

        String projectDir = System.getProperty("user.dir");

        Path uploadPath = Paths.get(
                projectDir,
                "src/main/resources/static/images",
                folder
        );

        Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);

        file.transferTo(filePath.toFile());

        return "/images/" + folder + "/" + fileName;
    }
}
