package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="wishlist")
public class Wishlist {
    @EmbeddedId
    private WishlistKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseId")
    @JoinColumn(name="course_id", nullable=false)
    private Course course;
}
