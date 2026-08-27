package SpringProject.courses_management_system.dto.CourseBatch;

import java.util.UUID;

public record AssignableStudent(
        UUID id,
        String name,
        String email
) {
}
