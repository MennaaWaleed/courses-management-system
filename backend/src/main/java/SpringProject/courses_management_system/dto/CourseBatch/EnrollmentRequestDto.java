package SpringProject.courses_management_system.dto.CourseBatch;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDto {
    private UUID id;
    private UUID studentId;
    private String studentName;
    private String studentEmail;
    private UUID courseId;
    private String courseName;
    private UUID batchId;
    private String batchName;
    private String status;
    private LocalDateTime requestedAt;
}