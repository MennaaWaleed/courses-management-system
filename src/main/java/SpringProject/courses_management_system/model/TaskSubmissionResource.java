package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="TaskSubmissionResource")
public class TaskSubmissionResource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name="student_id", referencedColumnName="student_id", nullable=false),
            @JoinColumn(name="task_id", referencedColumnName="task_id", nullable=false)
    })
    private TaskSubmission taskSubmission;

    @Column(name="name", nullable=false, length=200)
    private String name;

    @Column(name="fileUrl", nullable=false, length=1000)
    private String fileUrl;

    @Column(name="size", nullable=false)
    private Long size;

    @Column(name="type", nullable=false, length=100)
    private String type;

    @CreationTimestamp
    @Column(name="createdAt", nullable=false, updatable=false)
    private ZonedDateTime createdAt;
}