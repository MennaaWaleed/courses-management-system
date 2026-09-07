package SpringProject.courses_management_system.dto.auth;

import SpringProject.courses_management_system.validation.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank(message = "Password is required")
    @StrongPassword
    private String password;

    private String phone;
}
