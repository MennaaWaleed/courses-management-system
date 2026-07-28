package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="batch_id", nullable=false)
    private CourseBatch courseBatch;

    @Column(name="Title", nullable=false, length=500)
    private String title;

    @Column(name="duedate", nullable=false)
    private ZonedDateTime dueDate;

    @Column(name="published", nullable=false)
    private ZonedDateTime published;

    @Column(name="description", nullable=false, columnDefinition="TEXT")
    private String description;
}