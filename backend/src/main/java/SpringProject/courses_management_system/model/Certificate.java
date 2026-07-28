package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;

@Data
@Entity
@Table(name="certificate")
public class Certificate {

    @EmbeddedId
    private CertificateKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name="student_id", nullable=false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("batchId")
    @JoinColumn(name="batch_id", nullable=false)
    private CourseBatch courseBatch;

    @Column(name="certificateurl", nullable=false, length=1000)
    private String certificateUrl;

    @CreationTimestamp
    @Column(name="issuedat", nullable=false, updatable=false)
    private ZonedDateTime issuedAt;
}