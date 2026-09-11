package SpringProject.courses_management_system.dto.MyCourses;

import java.time.ZonedDateTime;
import java.util.UUID;

public record MyCourseResponse(
        UUID courseId,
        String courseName,
        String courseDescription,
        String courseImageUrl,

        UUID batchId,
        String batchName,
        String batchStatus,
        String attendanceType,

        ZonedDateTime startDate,
        ZonedDateTime endDate,

        String enrollmentStatus
) {
}
