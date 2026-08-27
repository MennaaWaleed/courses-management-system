package SpringProject.courses_management_system.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class EnrollmentKey implements Serializable {
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "batch_id")
    private UUID batchId;
}