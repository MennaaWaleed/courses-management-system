package SpringProject.courses_management_system.dto.Category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    private String categoryName;

    private String categoryDescription;

    private String categoryImageUrl;

    private String shortDescription;
}
