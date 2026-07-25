package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="ContactMessage")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @Column(name="name", nullable=false, length=100)
    private String name;

    @Column(name="title", nullable=false, length=300)
    private String title;

    @Column(name="type", nullable=false, length=100)
    private String type;

    @Column(name="message", nullable=false, columnDefinition="TEXT")
    private String message;

    @Column(name="read", nullable=false)
    private boolean read = false;

    @CreationTimestamp
    @Column(name="createdAt", nullable=false, updatable=false)
    private ZonedDateTime createdAt;
}