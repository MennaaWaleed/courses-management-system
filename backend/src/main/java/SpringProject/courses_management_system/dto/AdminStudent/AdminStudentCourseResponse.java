package SpringProject.courses_management_system.dto.AdminStudent;

import java.time.ZonedDateTime;
import java.util.UUID;

public record AdminStudentCourseResponse(
        UUID courseId,
        String courseName,
        UUID batchId,
        String batchName,
        UUID instructorId,
        String instructorName,
        String enrollmentStatus,
        String paymentStatus,
        ZonedDateTime enrolledAt,
        ZonedDateTime startDate,
        ZonedDateTime endDate
) {
}