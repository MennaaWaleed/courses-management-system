package SpringProject.courses_management_system.dto.User;

import lombok.Data;

@Data
public class InstructorCreateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
}