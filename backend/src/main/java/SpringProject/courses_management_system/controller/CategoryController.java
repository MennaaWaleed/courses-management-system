package SpringProject.courses_management_system.controller;


import SpringProject.courses_management_system.dto.Category.CategoryRequest;
import SpringProject.courses_management_system.dto.Category.CategoryResponse;
import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping
    public CategoryResponse createCategory(@RequestBody CategoryRequest request) {
        return categoryService.createCategory(request);
    }

    @PutMapping("/{id}/publish")
    public CategoryResponse togglePublished(@PathVariable UUID id) {
        return categoryService.togglePublished(id);
    }

    @GetMapping("/{id}")
    public CategoryResponse getCategoryById(@PathVariable UUID id) {
        return categoryService.getCategoryById(id);
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryRequest request) {

        return categoryService.updateCategory(id, request);
    }

    @GetMapping("/published")
    public List<CategoryResponse> getPublishedCategories() {
        return categoryService.getPublishedCategories();
    }


    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
    }

}
