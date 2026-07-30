package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

@Data
@Entity
@Table(name="review")
public class Review {
    @EmbeddedId
    private ReviewKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseId")
    @JoinColumn(name="course_id", nullable=false)
    private Course course;

    @Column(name="rating", nullable=false)
    private int rating;

    @Column(name="comment", columnDefinition="TEXT")
    private String comment;

    @CreationTimestamp
    @Column(name="created_at", nullable=false, updatable=false)
    private ZonedDateTime createdAt;
}
