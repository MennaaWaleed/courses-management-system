package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="taskresource")
public class TaskResource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="task_id", nullable=false)
    private Task task;

    @Column(name="name", nullable=false, length=200)
    private String name;

    @Column(name="fileurl", nullable=false, length=1000)
    private String fileUrl;

    private Long size;

    @Column(name="type", nullable=false, length=100)
    private String type;

    @CreationTimestamp
    @Column(name="createdat", nullable=false, updatable=false)
    private ZonedDateTime createdAt;
}