package SpringProject.courses_management_system.dto.AdminStudent;

import java.time.ZonedDateTime;
import java.util.UUID;

public record AvailableBatchResponse(
        UUID id,
        String batchName,
        String courseName,
        String instructorName,
        String status,
        int capacity,
        long enrolledStudents,
        ZonedDateTime startDate,
        ZonedDateTime endDate
) {
}