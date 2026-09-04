package SpringProject.courses_management_system.dto.Contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank(message = "Name is required.")
    @Size(max = 100, message = "Name cannot exceed 100 characters.")
    private String name;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email address.")
    private String email;

    @NotBlank(message = "Phone number is required.")
    @Pattern(
            regexp = "^[0-9+\\-() ]{7,20}$",
            message = "Invalid phone number."
    )
    private String phone;


    @NotBlank(message = "Message is required.")
    @Size(max = 5000, message = "Message is too long.")
    private String message;
}