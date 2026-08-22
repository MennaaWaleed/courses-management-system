package SpringProject.courses_management_system.dto.ProfileData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistCourseResponse {

    private String courseName;
    private int price;
}
