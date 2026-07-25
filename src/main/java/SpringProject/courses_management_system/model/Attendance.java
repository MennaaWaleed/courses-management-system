package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="attendance")
public class Attendance {

    @EmbeddedId
    private AttendanceKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("lectureId")
    @JoinColumn(name="lecture_id", nullable=false)
    private Lecture lecture;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name="student_id", nullable=false)
    private User student;

    @Column(name="status", nullable=false, length=50)
    private String status;

}