package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.CourseBatch.EnrollmentRequestDto;
import SpringProject.courses_management_system.model.EnrollmentRequest;
import SpringProject.courses_management_system.enums.EnrollmentRequestStatus;
import SpringProject.courses_management_system.model.*;
import SpringProject.courses_management_system.repository.CourseBatchRepository;
import SpringProject.courses_management_system.repository.EnrollmentRepository;
import SpringProject.courses_management_system.repository.EnrollmentRequestRepository;
import SpringProject.courses_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentRequestService {

    private final EnrollmentRequestRepository requestRepository;
    private final CourseBatchRepository batchRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public EnrollmentRequestDto createRequest(String email, UUID courseId, String batchCode) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        CourseBatch batch = batchRepository.findByBatchCode(batchCode)
                .orElseThrow(() -> new RuntimeException("Invalid batch code."));

        if (!batch.getCourse().getId().equals(courseId)) {
            throw new RuntimeException("This batch code does not belong to this course.");
        }

        if (batch.getCodeExpiresAt() != null && batch.getCodeExpiresAt().isBefore(ZonedDateTime.now())) {
            throw new RuntimeException("This batch code has expired.");
        }

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByIdUserIdAndIdBatchId(student.getId(), batch.getId());
        if (existingEnrollment.isPresent() && !existingEnrollment.get().isRemoved()) {
            throw new RuntimeException("You are already enrolled in this batch.");
        }

        Optional<EnrollmentRequest> pendingRequest = requestRepository.findByUserIdAndCourseBatchIdAndStatus(
                student.getId(), batch.getId(), EnrollmentRequestStatus.PENDING);

        if (pendingRequest.isPresent()) {
            throw new RuntimeException("You already have a pending request for this batch.");
        }

        EnrollmentRequest request = new EnrollmentRequest();
        request.setUser(student);
        request.setCourseBatch(batch);
        request.setStatus(EnrollmentRequestStatus.PENDING);

        EnrollmentRequest savedRequest = requestRepository.save(request);
        return mapToDto(savedRequest);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentRequestDto> getMyRequests(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found."));
        return requestRepository.findByUserIdWithDetails(student.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EnrollmentRequestDto> getAllRequests() {
        return requestRepository.findAllWithDetails()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public void acceptRequest(UUID requestId) {
        EnrollmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found."));

        if (request.getStatus() != EnrollmentRequestStatus.PENDING) {
            throw new RuntimeException("This request can no longer be processed.");
        }

        User student = request.getUser();
        CourseBatch batch = request.getCourseBatch();

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByIdUserIdAndIdBatchId(student.getId(), batch.getId());

        if (existingEnrollment.isPresent()) {
            Enrollment enrollment = existingEnrollment.get();
            if (!enrollment.isRemoved()) {
                throw new RuntimeException("Student is already enrolled in this batch.");
            }
            enrollment.setRemoved(false);
            enrollmentRepository.save(enrollment);
        } else {
            Enrollment newEnrollment = new Enrollment();
            EnrollmentKey key = new EnrollmentKey();
            key.setUserId(student.getId());
            key.setBatchId(batch.getId());

            newEnrollment.setId(key);
            newEnrollment.setUser(student);
            newEnrollment.setCourseBatch(batch);
            newEnrollment.setRemoved(false);
            newEnrollment.setStatus("ENROLLED");
            newEnrollment.setAmountPaid(BigDecimal.ZERO);
            newEnrollment.setPaymentStatus("UNPAID");
            newEnrollment.setDeliveryMode(batch.getAttendanceType());

            enrollmentRepository.save(newEnrollment);
        }

        request.setStatus(EnrollmentRequestStatus.ACCEPTED);
        requestRepository.save(request);
    }

    @Transactional
    public void declineRequest(UUID requestId) {
        EnrollmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found."));

        if (request.getStatus() != EnrollmentRequestStatus.PENDING) {
            throw new RuntimeException("This request can no longer be processed.");
        }

        request.setStatus(EnrollmentRequestStatus.DECLINED);
        requestRepository.save(request);
    }

    private EnrollmentRequestDto mapToDto(EnrollmentRequest req) {
        return new EnrollmentRequestDto(
                req.getId(),
                req.getUser().getId(),
                req.getUser().getFirstName() + " " + req.getUser().getLastName(),
                req.getUser().getEmail(),
                req.getCourseBatch().getCourse().getId(),
                req.getCourseBatch().getCourse().getCourseName(),
                req.getCourseBatch().getId(),
                req.getCourseBatch().getBatchName(),
                req.getStatus().name(),
                req.getRequestedAt()
        );
    }
}