package SpringProject.courses_management_system.model;

import SpringProject.courses_management_system.model.enums.ResourceSource;
import SpringProject.courses_management_system.model.enums.ResourceType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="lectureresource")
public class LectureResource {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="lecture_id", nullable=false)
    private Lecture lecture;

    @Column(name="name", nullable=false, length=200)
    private String name;

    @Column(name="fileurl", nullable=false, length=1000)
    private String fileUrl;

    @Column(name="size")
    private Long size;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "type",
            nullable = false,
            length = 50
    )
    private ResourceType type;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "source",
            nullable = false,
            length = 50
    )
    private ResourceSource source;

    @CreationTimestamp
    @Column(name="createdat", nullable=false, updatable=false)
    private ZonedDateTime createdAt;
}