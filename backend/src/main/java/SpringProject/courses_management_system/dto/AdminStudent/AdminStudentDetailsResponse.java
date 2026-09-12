package SpringProject.courses_management_system.dto.AdminStudent;

import java.util.List;
import java.util.UUID;

public record AdminStudentDetailsResponse(
        UUID id,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String phoneNumber,
        boolean enabled,
        List<AdminStudentCourseResponse> courses
) {
}