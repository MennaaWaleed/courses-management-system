package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="contactmessage")
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @Column(name="name", nullable=false, length=100)
    private String name;


    @Column(name="message", nullable=false, columnDefinition="TEXT")
    private String message;

    @CreationTimestamp
    @Column(name="createdat", nullable=false, updatable=false)
    private ZonedDateTime createdAt;

    @Column(name="email",nullable=false, length=255)
    private String email;

    @Column(name="phone",nullable=false, length=20)
    private String phone;

    @Column(name="is_deleted", nullable=false)
    private boolean isDeleted = false;

    @Column(name="is_contacted", nullable=false)
    private boolean isContacted = false;
}