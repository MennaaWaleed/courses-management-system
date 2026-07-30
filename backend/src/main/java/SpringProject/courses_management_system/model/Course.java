package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
@Table(name="course")
public class Course {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @Column(name="name", nullable=false, unique=true, length=100)
    private String courseName;

    @Column(name="description", nullable=false, columnDefinition="TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id", nullable=false)
    private Category category;

    @Column(name="published", nullable=false)
    private boolean published=false;

    @Column(name="hours", nullable=false, precision=4, scale=1)
    private BigDecimal courseHours;

    @Column(name="lecture_count", nullable=false)
    private int lectureCount;

    @Column(name="image_url", length=500)
    private String imageUrl;

    @Column(name="price", nullable=false)
    private int price;

    @Column(name="featured", nullable=false)
    private boolean featured;
}

