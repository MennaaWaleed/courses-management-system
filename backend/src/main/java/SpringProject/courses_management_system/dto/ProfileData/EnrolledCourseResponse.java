package SpringProject.courses_management_system.dto.ProfileData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrolledCourseResponse {
    private String courseName;
    private String batchName;
    private String certificateUrl;
    private UUID batchId;
}
