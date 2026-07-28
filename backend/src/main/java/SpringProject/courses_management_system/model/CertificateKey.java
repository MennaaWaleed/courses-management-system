package SpringProject.courses_management_system.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class CertificateKey implements Serializable {
    private UUID studentId;
    private UUID batchId;
}