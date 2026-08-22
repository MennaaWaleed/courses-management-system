package SpringProject.courses_management_system.dto.ProfileData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrolledCourseResponse {
    private String courseName;
    private String batchName;
    private String certificateUrl;
}
