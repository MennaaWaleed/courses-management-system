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
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository; // تم إضافة CourseRepository هنا

    // حقن (Injection) للـ CourseRepository في الـ Constructor
    public CategoryService(CategoryRepository categoryRepository, CourseRepository courseRepository) {
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
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
        response.setCategoryShortDescription(category.getShortDescription());
        response.setPublished(category.isPublished());
        return response;
    }

    public CategoryResponse createCategory(
            String categoryName, String categoryDescription,
            String shortDescription, MultipartFile image
    ) {
        Category category = new Category();
        category.setCategoryName(categoryName);
        category.setDescription(categoryDescription);
        category.setShortDescription(shortDescription);

        if (image != null && !image.isEmpty()) {
            try {
                Path uploadPath = Paths.get("images/categories");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String originalFileName = image.getOriginalFilename();
                String fileName = UUID.randomUUID() + "_" + originalFileName;
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                category.setImageUrl("/images/categories/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Could not save image", e);
            }
        } else {
            category.setImageUrl("");
        }

        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return convertToResponse(category);
    }

    public CategoryResponse togglePublished(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setPublished(!category.isPublished());
        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    public CategoryResponse updateCategory(
            UUID id, String categoryName, String categoryDescription,
            String shortDescription, MultipartFile image
    ) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setCategoryName(categoryName);
        category.setDescription(categoryDescription);
        category.setShortDescription(shortDescription);

        if (image != null && !image.isEmpty()) {
            try {
                Path uploadPath = Paths.get("src/main/resources/static/images/categories");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String originalFileName = image.getOriginalFilename();
                String extension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    extension = originalFileName.substring(originalFileName.lastIndexOf("."));
                }
                String fileName = UUID.randomUUID() + extension;
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                category.setImageUrl("/images/categories/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Could not save image", e);
            }
        }

        Category updatedCategory = categoryRepository.save(category);
        return convertToResponse(updatedCategory);
    }

    // ==========================================
    // تم التعديل هنا لتنفيذ اللوجيك المطلوب
    // ==========================================
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 1. عمل Soft Delete للـ Category الأساسية
        category.setDeleted(true);
        categoryRepository.save(category);

        // 2. نجيب كل الكورسات اللي تبع الـ Category دي
        List<Course> courses = courseRepository.findAdminCoursesByCategoryId(id);

        for (Course course : courses) {
            // 3. بنمسح الـ Category دي من الكورس عشان متبقاش مرتبطة بيه
            course.getCategories().removeIf(c -> c.getId().equals(id));

            // 4. بنشيك هل الكورس لسه عنده أي Category تانية شغالة (مش ممسوحة)
            boolean hasOtherActiveCategories = course.getCategories().stream()
                    .anyMatch(c -> !c.isDeleted());

            // 5. لو معندوش أي Category شغالة، نمسح الكورس (Soft Delete = true)
            if (!hasOtherActiveCategories) {
                course.setDeleted(true);
            }

            // 6. نحفظ التعديلات على الكورس
            courseRepository.save(course);
        }
    }

    public List<CategoryResponse> getPublishedCategories() {
        List<Category> categories = categoryRepository.findByPublishedTrueAndIsDeletedFalse();
        return categories.stream().map(this::convertToResponse).toList();
    }

    public String uploadImage(MultipartFile image) {
        try {
            String originalFileName = image.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID() + extension;
            Path uploadPath = Paths.get("src/main/resources/static/images/categories");
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/images/categories/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not upload image", e);
        }
    }
}