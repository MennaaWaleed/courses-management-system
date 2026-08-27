package SpringProject.courses_management_system.dto.CourseBatch;

import java.util.UUID;

public record BatchStudent(
        UUID studentId,
        String fullName,
        String email,
        String phoneNumber,
        UUID batchId,
        String batchName
) {}
