package SpringProject.courses_management_system.dto.User;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class InstructorResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private boolean enabled;
    private ZonedDateTime createdAt;
}