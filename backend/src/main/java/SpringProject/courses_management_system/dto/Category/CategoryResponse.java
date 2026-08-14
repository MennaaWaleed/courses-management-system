package SpringProject.courses_management_system.dto.Category;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CategoryResponse {
    private UUID id;
    private String categoryName;
    private String categoryDescription;
    private String categoryImageUrl;
    private String categoryShortDescription;
    private boolean published;
}