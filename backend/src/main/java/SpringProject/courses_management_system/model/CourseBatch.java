package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="course_batch")
public class CourseBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="course_id", nullable=false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="instructor_id", nullable=false)
    private User instructor;

    @Column(name="name", nullable=false, length=100)
    private String batchName;

    @Column(name="status", nullable=false, length=20)
    private String status;

    @Column(name="attendance_type", nullable=false, length=20)
    private String attendanceType;

    @Column(name="capacity", nullable=false)
    private int capacity;

    @Column(name="start_date", nullable=false)
    private ZonedDateTime startDate;

    @Column(name="end_date", nullable=false)
    private ZonedDateTime endDate;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

}
