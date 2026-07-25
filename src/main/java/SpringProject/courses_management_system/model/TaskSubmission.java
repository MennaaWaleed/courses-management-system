package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name="TaskSubmission")
public class TaskSubmission {

    @EmbeddedId
    private TaskSubmissionKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name="student_id", nullable=false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("taskId")
    @JoinColumn(name="task_id", nullable=false)
    private Task task;

    @Column(name="status", nullable=false, length=50)
    private String status;

    @Column(name="feedback", columnDefinition="TEXT")
    private String feedback;

    @Column(name="grade", precision=5, scale=2)
    private BigDecimal grade;

    @CreationTimestamp
    @Column(name="submittedAt", nullable=false, updatable=false)
    private ZonedDateTime submittedAt;
}