package SpringProject.courses_management_system.dto.auth.ResetPassword;
import SpringProject.courses_management_system.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VerifyResetCodeRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Verification code is required")

    private String code;
}