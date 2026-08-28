package SpringProject.courses_management_system.dto.CourseBatch;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateEnrollmentRequest {
    private String batchCode;
}