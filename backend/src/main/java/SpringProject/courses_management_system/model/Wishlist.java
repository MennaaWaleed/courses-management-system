package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Entity
@Table(name="wishlist")
@Getter
@Setter
@NoArgsConstructor
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
