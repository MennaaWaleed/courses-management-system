package SpringProject.courses_management_system.dto.auth.SetPassword;

import lombok.Data;

@Data
public class SetPasswordResponse {
    private String message;
    private String token;
    private String role; 
}
