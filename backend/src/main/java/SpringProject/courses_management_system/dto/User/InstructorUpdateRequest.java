package SpringProject.courses_management_system.dto.User;

import lombok.Data;

@Data
public class InstructorUpdateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
}