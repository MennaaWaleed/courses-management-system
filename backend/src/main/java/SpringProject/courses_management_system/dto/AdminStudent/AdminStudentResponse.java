package SpringProject.courses_management_system.dto.AdminStudent;

import java.util.UUID;

public record AdminStudentResponse(
        UUID id,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String phoneNumber,
        boolean enabled,
        long enrolledCourses
) {
}