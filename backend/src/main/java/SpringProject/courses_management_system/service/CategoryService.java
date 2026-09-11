package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Category.CategoryResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.repository.CategoryRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ImageService imageService;

    public CategoryService(
            CategoryRepository categoryRepository,
            CourseRepository courseRepository,
            ImageService imageService
    ) {
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.imageService = imageService;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findByIsDeletedFalse();
    }

    private CategoryResponse convertToResponse(Category category) {

        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());
        response.setCategoryName(category.getCategoryName());
        response.setCategoryDescription(category.getDescription());
        response.setCategoryImageUrl(category.getImageUrl());
        response.setCategoryShortDescription(
                category.getShortDescription()
        );
        response.setPublished(category.isPublished());

        return response;
    }

    // =========================================================
    // CREATE CATEGORY
    // =========================================================

    public CategoryResponse createCategory(
            String categoryName,
            String categoryDescription,
            String shortDescription,
            MultipartFile image
    ) {

        Category category = new Category();

        category.setCategoryName(categoryName);
        category.setDescription(categoryDescription);
        category.setShortDescription(shortDescription);

        if (image != null && !image.isEmpty()) {

            try {

                byte[] webpImage =
                        imageService.compressToWebP(image);

                Path uploadPath =
                        Paths.get(
                                "src/main/resources/static/images/categories"
                        );

                Files.createDirectories(uploadPath);

                String fileName =
                        UUID.randomUUID() + ".webp";

                Path filePath =
                        uploadPath.resolve(fileName);

                Files.write(filePath, webpImage);

                category.setImageUrl(
                        "/images/categories/" + fileName
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Could not save image",
                        e
                );
            }

        } else {

            category.setImageUrl("");
        }

        Category savedCategory =
                categoryRepository.save(category);

        return convertToResponse(savedCategory);
    }

    // =========================================================
    // GET CATEGORY BY ID
    // =========================================================

    public CategoryResponse getCategoryById(UUID id) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Category not found"
                                )
                        );

        return convertToResponse(category);
    }

    // =========================================================
    // TOGGLE PUBLISHED
    // =========================================================

    @Transactional
    public CategoryResponse togglePublished(UUID id) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Category not found"
                                )
                        );

        boolean isNowPublished =
                !category.isPublished();

        category.setPublished(isNowPublished);

        Category savedCategory =
                categoryRepository.save(category);

        if (!isNowPublished) {

            List<Course> courses =
                    courseRepository.findAdminCoursesByCategoryId(id);

            for (Course course : courses) {

                boolean hasOtherPublishedCategories =
                        course.getCategories()
                                .stream()
                                .anyMatch(
                                        c ->
                                                !c.getId().equals(id)
                                                        && c.isPublished()
                                                        && !c.isDeleted()
                                );

                if (!hasOtherPublishedCategories) {

                    course.setPublished(false);

                    courseRepository.save(course);
                }
            }
        }

        return convertToResponse(savedCategory);
    }

    // =========================================================
    // UPDATE CATEGORY
    // =========================================================

    public CategoryResponse updateCategory(
            UUID id,
            String categoryName,
            String categoryDescription,
            String shortDescription,
            MultipartFile image
    ) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Category not found"
                                )
                        );

        category.setCategoryName(categoryName);
        category.setDescription(categoryDescription);
        category.setShortDescription(shortDescription);

        // If a new image was uploaded
        if (image != null && !image.isEmpty()) {

            try {

                // Compress + resize + convert to WebP
                byte[] webpImage =
                        imageService.compressToWebP(image);

                Path uploadPath =
                        Paths.get(
                                "src/main/resources/static/images/categories"
                        );

                Files.createDirectories(uploadPath);

                // Always save as WebP
                String fileName =
                        UUID.randomUUID() + ".webp";

                Path filePath =
                        uploadPath.resolve(fileName);

                Files.write(filePath, webpImage);

                // Update database URL
                category.setImageUrl(
                        "/images/categories/" + fileName
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Could not save image",
                        e
                );
            }
        }

        Category updatedCategory =
                categoryRepository.save(category);

        return convertToResponse(updatedCategory);
    }

    // =========================================================
    // DELETE CATEGORY
    // =========================================================

    @Transactional
    public void deleteCategory(UUID id) {

        Category category =
                categoryRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Category not found"
                                )
                        );

        category.setDeleted(true);

        categoryRepository.save(category);

        List<Course> courses =
                courseRepository.findAdminCoursesByCategoryId(id);

        for (Course course : courses) {

            course.getCategories()
                    .removeIf(
                            c -> c.getId().equals(id)
                    );

            boolean hasOtherActiveCategories =
                    course.getCategories()
                            .stream()
                            .anyMatch(
                                    c -> !c.isDeleted()
                            );

            if (!hasOtherActiveCategories) {

                course.setDeleted(true);
            }

            courseRepository.save(course);
        }
    }

    // =========================================================
    // GET PUBLISHED CATEGORIES
    // =========================================================

    public List<CategoryResponse> getPublishedCategories() {

        List<Category> categories =
                categoryRepository
                        .findByPublishedTrueAndIsDeletedFalse();

        return categories
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // UPLOAD IMAGE
    // =========================================================

    public String uploadImage(MultipartFile image) {

        try {

            // Compress + resize + convert to WebP
            byte[] webpImage =
                    imageService.compressToWebP(image);

            Path uploadPath =
                    Paths.get(
                            "src/main/resources/static/images/categories"
                    );

            Files.createDirectories(uploadPath);

            // Always save as WebP
            String fileName =
                    UUID.randomUUID() + ".webp";

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.write(filePath, webpImage);

            return "/images/categories/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not upload image",
                    e
            );
        }
    }
}