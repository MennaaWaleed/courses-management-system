package SpringProject.courses_management_system.model;

import jakarta.persistence.*;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    private UUID id;

    @Column(name="first_name",nullable=false,length=100)
    private String firstName;

    @Column(name="last_name",nullable=false,length=100)
    private String lastName;

    @Column(name="email",nullable=false,unique=true,length = 255)
    private String email;

    @Column(name="password",nullable=false,length = 255)
    private String password;

    @Column(name="phone",length = 20)
    private String phoneNumber;

    @Column(name="role",nullable=false,length = 20)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name="enabled",nullable=false)
    private boolean enabled=true;

    @CreationTimestamp
    @Column(name="created_at",nullable=false,updatable=false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at",nullable=false)
    private ZonedDateTime updatedAt;

}
