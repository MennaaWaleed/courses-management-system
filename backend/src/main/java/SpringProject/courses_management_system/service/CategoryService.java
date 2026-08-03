package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.model.Category;
import SpringProject.courses_management_system.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {

        Category category ;
//         category = new Category();
//        category.setCategoryName("Architecture");
//        category.setDescription("Learn professional architectural design using Autodesk Revit, AutoCAD, and visualization tools. Master BIM workflows, project documentation, rendering, and real-world architectural projects from concept to construction.");
//        category.setShortDescription("BIM Design & Architectural Visualization");
//
//       category.setImageUrl("/images/categories/architecture.png");
//       categoryRepository.save(category);


//
//
//        category = new Category();
//        category.setCategoryName("Mechanical");
//        category.setDescription("Master Mechanical BIM by designing HVAC systems, plumbing networks, and fire protection solutions. Gain practical experience with Revit MEP and engineering design standards used in real projects.");
//        category.setShortDescription("HVAC • Plumbing • Fire Fighting");
//
//        category.setImageUrl("/images/categories/mechanical.png");
//        categoryRepository.save(category);
//
//
//
//
//        category = new Category();
//        category.setCategoryName("Electrical");
//        category.setDescription("Learn electrical building systems including power distribution, lighting design, cable routing, and BIM coordination. Work on complete electrical projects using Autodesk Revit MEP.");
//        category.setShortDescription("Power • Lighting • BIM MEP");
//
//        category.setImageUrl("/images/categories/electrical.png");
//        categoryRepository.save(category);
//
//
//        category = new Category();
//        category.setCategoryName("civil");
//        category.setDescription("Build professional skills in civil engineering using Autodesk Civil 3D. Learn road design, grading, land development, surveying, and infrastructure workflows through real engineering case studies.");
//        category.setShortDescription("Infrastructure & Road Design");
//
//        category.setImageUrl("/images/categories/civil.png");
//        categoryRepository.save(category);
//
//        category = new Category();
//        category.setCategoryName("Interior Design");
//        category.setDescription("Create modern interior spaces using 3ds Max, Revit, and rendering tools. Learn space planning, furniture modeling, materials, lighting, and photorealistic visualization for residential and commercial projects.");
//        category.setShortDescription("Visualization & Interior Modeling");
//
//        category.setImageUrl("/images/categories/inerior_design.png");
//        categoryRepository.save(category);



        category = new Category();
        category.setCategoryName("Structure");
        category.setDescription("Develop structural engineering skills using Revit Structure and industry-standard analysis software. Learn reinforced concrete, steel structures, detailing, and BIM coordination through practical engineering projects.");
        category.setShortDescription("Structural Analysis & BIM Modeling");

        category.setImageUrl("/images/categories/structure.png");
        categoryRepository.save(category);

        return categoryRepository.findAll();


    }

}