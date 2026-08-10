package SpringProject.courses_management_system.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name="course")

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})


public class Course {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @Column(name="name", nullable=false, unique=true, length=100)
    private String courseName;

    @Column(name="description", nullable=false, columnDefinition="TEXT")
    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "course_category",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @Column(name="published", nullable=false)
    private boolean published=false;

    @Column(name="hours", nullable=false, precision=4, scale=1)
    private BigDecimal courseHours;

    @Column(name="lecture_count", nullable=false)
    private int lectureCount;

    @Column(name="image_url", length=500)
    private String imageUrl;

    @Column(name="icon_url", length=500)
    private String iconUrl;

    @Column(name="price", nullable=false)
    private int price;

    @Column(name="featured", nullable=false)
    private boolean featured;

    @Column(name = "short_description", nullable = false, length = 500)
    private String shortDescription;

    @Column(name="content_url",nullable=false, length=1000)
    private String content_url;
}

