package SpringProject.courses_management_system.dto.ProfileData;

import java.util.UUID;

public record AssignedBatchResponse(
        UUID batchId,
        String courseName,
        String batchName
) {}