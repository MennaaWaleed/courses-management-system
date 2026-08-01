package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="contactmessage")
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

    @CreationTimestamp
    @Column(name="createdat", nullable=false, updatable=false)
    private ZonedDateTime createdAt;

    @Column(name="email",nullable=false, length=255)
    private String email;

    @Column(name="phone",nullable=false, length=20)
    private String phone;
}