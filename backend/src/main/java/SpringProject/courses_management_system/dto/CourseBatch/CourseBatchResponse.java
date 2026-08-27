package SpringProject.courses_management_system.dto.CourseBatch;


import java.time.ZonedDateTime;
import java.util.UUID;

public record CourseBatchResponse(
        UUID id,
        String batchName,
        String status,
        String attendanceType,
        int capacity,
        ZonedDateTime startDate,
        ZonedDateTime endDate,
        UUID courseId,
        String courseName,
        UUID instructorId,
        String instructorName
) {}
