package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Certificate;
import SpringProject.courses_management_system.model.CertificateKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, CertificateKey> {
    Optional<Certificate> findByStudentIdAndCourseBatchId(
            UUID studentId,
            UUID batchId
    );
}
