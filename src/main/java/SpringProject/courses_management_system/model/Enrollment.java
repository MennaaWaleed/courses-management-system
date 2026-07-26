package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name="enrollment")
public class Enrollment {

    @EmbeddedId
    private EnrollmentKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("batchId")
    @JoinColumn(name="batch_id", nullable=false)
    private CourseBatch courseBatch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="coupon_id")
    private Coupon coupon;

    @Column(name="status", nullable=false, length=50)
    private String status;

    @Column(name="amountpaid", nullable=false, precision=12, scale=5)
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Column(name="paymentstatus", nullable=false, length=50)
    private String paymentStatus;

    @Column(name="deliverymode", nullable=false, length=50)
    private String deliveryMode;

    @Column(name="meetinglink", length=1000)
    private String meetingLink;

    @CreationTimestamp
    @Column(name="enrolledat", nullable=false, updatable=false)
    private ZonedDateTime enrolledAt;
}