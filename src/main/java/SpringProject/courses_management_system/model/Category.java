package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name="category")
public class Category {
    @Id
    @GeneratedValue(strategy= GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @Column(name="name", nullable=false,length=100)
    private String categoryName;

    @Column(name="description",nullable=false,columnDefinition="TEXT")
    private String description;

    @Column(name="image_url",nullable=false,length=500)
    private String imageUrl;
}
