package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Course.CourseResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.repository.CategoryRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    public CourseService(CourseRepository courseRepository, CategoryRepository categoryRepository, FileStorageService fileStorageService) {
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
    }

    // ==================================================
    // STUDENT LOGIC
    // ==================================================

    public List<CourseResponse> getFeaturedCourses() {
        return courseRepository.findStudentFeaturedCourses().stream()
                .map(this::convertToStudentResponse)
                .toList();
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAllStudentVisibleCourses().stream()
                .map(this::convertToStudentResponse)
                .toList();
    }

    public CourseResponse getStudentCourseById(UUID id) {
        Course course = courseRepository.findStudentCourseById(id)
                .orElseThrow(() -> new RuntimeException("Course not found or is currently unavailable"));
        return convertToStudentResponse(course);
    }

    public List<CourseResponse> getRelatedCourses(UUID courseId) {
        return courseRepository.findStudentRelatedCourses(courseId).stream()
                .map(this::convertToStudentResponse)
                .toList();
    }

    public List<CourseResponse> getCoursesByCategory(UUID categoryId) {
        return courseRepository.findStudentCoursesByCategoryId(categoryId).stream()
                .map(this::convertToStudentResponse)
                .toList();
    }

    /**
     * Converts to DTO, but explicitly strips out any unpublished or deleted categories
     * so they are not leaked via API payloads to the students.
     */
    private CourseResponse convertToStudentResponse(Course course) {
        CourseResponse response = convertToResponse(course);

        if (course.getCategories() != null) {
            List<UUID> visibleCategoryIds = course.getCategories().stream()
                    .filter(cat -> cat.isPublished() && !cat.isDeleted())
                    .map(Category::getId)
                    .toList();
            response.setCategoryIds(visibleCategoryIds);
        }

        return response;
    }


    // ==================================================
    // ADMIN LOGIC
    // ==================================================

    public List<CourseResponse> getAllCoursesResponse() {
        List<Course> courses = courseRepository.findByIsDeletedFalse();
        return courses.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public CourseResponse getAdminCourseById(UUID id) {
        Course course = courseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return convertToResponse(course);
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

        if (course.getCategories() != null) {
            List<UUID> categoryIds = course.getCategories().stream()
                    .map(Category::getId)
                    .toList();
            response.setCategoryIds(categoryIds);
        } else {
            response.setCategoryIds(new ArrayList<>());
        }
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

            List<Category> categories = categoryRepository.findAllById(categoryIds);
            if (categories.size() != categoryIds.size()) {
                throw new RuntimeException("One or more categories not found");
            }
            course.setCategories(new HashSet<>(categories));

            if (contentFile == null || contentFile.isEmpty()) {
                throw new RuntimeException("Course PDF is required");
            }
            String contentUrl = saveFile(contentFile, "courses/CoursesContent");
            course.setContent_url(contentUrl);

            if (courseImage == null || courseImage.isEmpty()) {
                throw new RuntimeException("Course image is required");
            }
            String imageUrl = saveFile(courseImage, "courses/images");
            course.setImageUrl(imageUrl);

            if (iconImage != null && !iconImage.isEmpty()) {
                String iconUrl = saveFile(iconImage, "courses/icons");
                course.setIconUrl(iconUrl);
            }

            Course savedCourse = courseRepository.save(course);
            return convertToResponse(savedCourse);

        } catch (IOException e) {
            throw new RuntimeException("Failed to save course files", e);
        }
    }

    public CourseResponse updateCourse(
            UUID id,
            String courseName,
            String description,
            String shortDescription,
            BigDecimal courseHours,
            int lectureCount,
            int price,
            List<UUID> categoryIds,
            boolean published,
            boolean featured,
            MultipartFile courseImage,
            MultipartFile iconImage,
            MultipartFile contentFile
    ) {
        Course course = courseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setCourseName(courseName);
        course.setDescription(description);
        course.setShortDescription(shortDescription);
        course.setCourseHours(courseHours);
        course.setLectureCount(lectureCount);
        course.setPrice(price);
        course.setPublished(published);
        course.setFeatured(featured);

        List<Category> categories = categoryRepository.findAllById(categoryIds);
        if (categories.size() != categoryIds.size()) {
            throw new RuntimeException("One or more categories not found");
        }
        course.setCategories(new HashSet<>(categories));

        if (courseImage != null && !courseImage.isEmpty()) {
            String imageUrl = fileStorageService.saveCourseImage(courseImage);
            course.setImageUrl(imageUrl);
        }

        if (iconImage != null && !iconImage.isEmpty()) {
            String iconUrl = fileStorageService.saveCourseIcon(iconImage);
            course.setIconUrl(iconUrl);
        }

        if (contentFile != null && !contentFile.isEmpty()) {
            String contentUrl = fileStorageService.saveContentFile(contentFile);
            course.setContent_url(contentUrl);
        }

        Course updatedCourse = courseRepository.save(course);
        return convertToResponse(updatedCourse);
    }

    public void deleteCourse(UUID id) {
        Course course = courseRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setDeleted(true);
        courseRepository.save(course);
    }

    public CourseResponse togglePublish(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setPublished(!course.isPublished());
        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }

    public CourseResponse toggleFeature(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setFeatured(!course.isFeatured());
        Course savedCourse = courseRepository.save(course);
        return convertToResponse(savedCourse);
    }

    private String saveFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID() + extension;
        String projectDir = System.getProperty("user.dir");
        Path uploadPath = Paths.get(projectDir, "src/main/resources/static/images", folder);
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(fileName);
        file.transferTo(filePath.toFile());
        return "/images/" + folder + "/" + fileName;
    }

    // ==================================================
    // ADMIN LOGIC
    // ==================================================

    // ADD THIS NEW METHOD
    public List<CourseResponse> getAdminCoursesByCategory(UUID categoryId) {
        return courseRepository.findAdminCoursesByCategoryId(categoryId).stream()
                .map(this::convertToResponse)
                .toList();
    }
}