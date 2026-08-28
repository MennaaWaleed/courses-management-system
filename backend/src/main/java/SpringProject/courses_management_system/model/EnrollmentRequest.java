package SpringProject.courses_management_system.model;

import SpringProject.courses_management_system.enums.EnrollmentRequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "enrollment_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private CourseBatch courseBatch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentRequestStatus status = EnrollmentRequestStatus.PENDING;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void setPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
