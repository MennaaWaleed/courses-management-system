package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.EnrollmentRequest;
import SpringProject.courses_management_system.enums.EnrollmentRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequest, UUID> {

    // للتحقق مما إذا كان الطالب لديه طلب معلق في نفس الدفعة
    Optional<EnrollmentRequest> findByUserIdAndCourseBatchIdAndStatus(UUID userId, UUID batchId, EnrollmentRequestStatus status);

    // لجلب طلبات الطالب الخاصة به
    @Query("SELECT r FROM EnrollmentRequest r JOIN FETCH r.courseBatch cb JOIN FETCH cb.course WHERE r.user.id = :userId ORDER BY r.requestedAt DESC")
    List<EnrollmentRequest> findByUserIdWithDetails(@Param("userId") UUID userId);

    // للأدمن: جلب كل الطلبات مع تفاصيل الطالب والكورس
    @Query("SELECT r FROM EnrollmentRequest r JOIN FETCH r.user JOIN FETCH r.courseBatch cb JOIN FETCH cb.course ORDER BY r.requestedAt DESC")
    List<EnrollmentRequest> findAllWithDetails();
}