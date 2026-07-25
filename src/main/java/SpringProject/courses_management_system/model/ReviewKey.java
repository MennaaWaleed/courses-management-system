package SpringProject.courses_management_system.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class ReviewKey implements Serializable {
    private UUID userId;
    private UUID courseId;
}
