package SpringProject.courses_management_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name="coupon")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="id")
    private UUID id;

    @Column(name="code", nullable=false, unique=true, length=50)
    private String code;

    @Column(name="discount_type", nullable=false, length=20)
    private String discountType;

    @Column(name="percentage", precision=5, scale=2)
    private BigDecimal percentage;

    @Column(name="fixed_amount", precision=10, scale=2)
    private BigDecimal fixedAmount;

    @Column(name="start_date", nullable=false)
    private ZonedDateTime startDate;

    @Column(name="end_date", nullable=false)
    private ZonedDateTime endDate;

    @Column(name="active", nullable=false)
    private boolean active;
}