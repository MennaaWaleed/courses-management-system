package SpringProject.courses_management_system.dto.CourseBatch;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.UUID;

public record CourseBatchRequest(
        @NotBlank(message = "Batch name is required")
        String batchName,

        @NotBlank(message = "Status is required (e.g. OPEN, ACTIVE)")
        String status,

        @NotBlank(message = "Attendance type is required (e.g. ONLINE, OFFLINE, HYBRID)")
        String attendanceType,

        @Min(value = 1, message = "Capacity must be at least 1")
        int capacity,

        @NotNull(message = "Start date is required")
        ZonedDateTime startDate,

        @NotNull(message = "End date is required")
        ZonedDateTime endDate,

        UUID instructorId
) {}