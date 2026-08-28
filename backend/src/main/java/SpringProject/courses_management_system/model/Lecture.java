package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name="lecture",
        uniqueConstraints={
            @UniqueConstraint(name="uq_batch_lecture_order",columnNames = {"batch_id", "lecture_order"})
        }
)
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="batch_id", nullable=false)
    private CourseBatch courseBatch;

    @Column(name="lecture_order", nullable=false)
    private int lectureOrder;

    @Column(name="title", nullable=false, length=200)
    private String title;

    @Column(name="published", nullable=false)
    private boolean published;



    @OneToMany( mappedBy = "lecture", cascade = CascadeType.ALL,orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<LectureResource> resources = new ArrayList<>();
}
