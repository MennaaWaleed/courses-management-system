package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Column(name="title", nullable=false, length=200)
    private String title;

    @Column(name="type", nullable=false, length=50)
    private String type;

    @Column(name="message", nullable=false, columnDefinition="TEXT")
    private String message;

    @Column(name="read", nullable=false)
    private boolean read = false;

    @CreationTimestamp
    @Column(name="created_at", nullable=false, updatable=false)
    private ZonedDateTime createdAt;
}