package SpringProject.courses_management_system.dto.ProfileData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistCourseResponse {
    UUID courseId;
    private String courseName;
    private int price;
}
