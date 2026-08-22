package SpringProject.courses_management_system.dto.ProfileData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    private List<EnrolledCourseResponse> enrolledCourses;

    private List<WishlistCourseResponse> wishlist;
}
