package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.Category.CategoryRequest;
import SpringProject.courses_management_system.dto.Category.CategoryResponse;
import SpringProject.courses_management_system.dto.Course.CourseResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.UUID;

@Service

public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }
    private CategoryResponse convertToResponse(Category category) {

        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());
        response.setCategoryName(category.getCategoryName());
        response.setCategoryDescription(category.getDescription());
        response.setCategoryImageUrl(category.getImageUrl());
        response.setCategoryShortDescription(category.getShortDescription());

        return response;
    }

    public CategoryResponse createCategory(CategoryRequest request) {

        Category category = new Category();

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getCategoryDescription());
        category.setShortDescription(request.getShortDescription());
        category.setImageUrl(request.getCategoryImageUrl());
        Category savedCategory = categoryRepository.save(category);

        return convertToResponse(savedCategory);
    }

    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return convertToResponse(category);
    }

    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getCategoryDescription());
        category.setShortDescription(request.getShortDescription());
        category.setImageUrl(request.getCategoryImageUrl());

        Category updatedCategory = categoryRepository.save(category);

        return convertToResponse(updatedCategory);
    }

    public void deleteCategory(UUID id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }
}