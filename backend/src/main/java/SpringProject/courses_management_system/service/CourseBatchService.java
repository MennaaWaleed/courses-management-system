package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.CourseBatch.BatchStudent;
import SpringProject.courses_management_system.dto.CourseBatch.CourseBatchRequest;
import SpringProject.courses_management_system.dto.CourseBatch.CourseBatchResponse;
import SpringProject.courses_management_system.dto.CourseBatch.DropdownItem;
import SpringProject.courses_management_system.model.*;
import SpringProject.courses_management_system.repository.CourseBatchRepository;
import SpringProject.courses_management_system.repository.CourseRepository;
import SpringProject.courses_management_system.repository.EnrollmentRepository;
import SpringProject.courses_management_system.repository.UserRepository;
import SpringProject.courses_management_system.dto.CourseBatch.AssignableStudent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseBatchService {

    private final CourseBatchRepository courseBatchRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Transactional(readOnly = true)
    public List<DropdownItem> getAllInstructorsDropdown() {
        return userRepository.findByRole(Role.INSTRUCTOR).stream()
                .map(u -> new DropdownItem(
                        u.getId(),
                        u.getFirstName() + " " + u.getLastName() + " (" + u.getUsername() + ")"
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CourseBatchResponse> getBatchesByCourseId(UUID courseId) {
        List<CourseBatch> batches = courseBatchRepository.findBatchesByCourseId(courseId);
        return batches.stream().map(this::mapToDTO).toList();
    }

    @Transactional
    public CourseBatchResponse createBatch(UUID courseId, CourseBatchRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("End date must be after start date.");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        User instructor = null;
        if (request.instructorId() != null) {
            instructor = userRepository.findById(request.instructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found with ID: " + request.instructorId()));
        }

        CourseBatch batch = new CourseBatch();
        batch.setBatchName(request.batchName());
        batch.setCourse(course);
        batch.setInstructor(instructor);
        batch.setStatus(request.status());
        batch.setAttendanceType(request.attendanceType());
        batch.setCapacity(request.capacity());
        batch.setStartDate(request.startDate());
        batch.setEndDate(request.endDate());

        CourseBatch savedBatch = courseBatchRepository.save(batch);
        return mapToDTO(savedBatch);
    }

    @Transactional
    public void deleteBatch(UUID courseBatchId) {
        courseBatchRepository.softDeleteBatchById(courseBatchId);
    }

    @Transactional
    public void softDeleteCourse(UUID courseId) {
        courseRepository.softDeleteById(courseId);
    }

    @Transactional
    public void removeStudentFromBatch(UUID studentId, UUID batchId) {
        enrollmentRepository.removeStudentFromBatch(studentId, batchId);
    }

    private CourseBatchResponse mapToDTO(CourseBatch batch) {
        String instructorName = "Unassigned";
        UUID instructorId = null;

        if (batch.getInstructor() != null) {
            instructorId = batch.getInstructor().getId();
            instructorName = batch.getInstructor().getFirstName() + " " + batch.getInstructor().getLastName();
        }

        return new CourseBatchResponse(
                batch.getId(),
                batch.getBatchName(),
                batch.getStatus(),
                batch.getAttendanceType(),
                batch.getCapacity(),
                batch.getStartDate(),
                batch.getEndDate(),
                batch.getCourse().getId(),
                batch.getCourse().getCourseName(),
                instructorId,
                instructorName
        );
    }

    @Transactional(readOnly = true)
    public List<BatchStudent> getStudentsByBatchId(UUID batchId) {
        return enrollmentRepository.findStudentsByBatchId(batchId);
    }

    @Transactional(readOnly = true)
    public CourseBatch getBatchById(UUID batchId) {
        return courseBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found with id: " + batchId));
    }

    @Transactional
    public CourseBatch updateBatch(UUID batchId, CourseBatch updatedData) {
        CourseBatch existingBatch = getBatchById(batchId);

        existingBatch.setBatchName(updatedData.getBatchName());
        existingBatch.setStatus(updatedData.getStatus());
        existingBatch.setAttendanceType(updatedData.getAttendanceType());
        existingBatch.setCapacity(updatedData.getCapacity());
        existingBatch.setStartDate(updatedData.getStartDate());
        existingBatch.setEndDate(updatedData.getEndDate());

        if (updatedData.getInstructor() != null) {
            existingBatch.setInstructor(updatedData.getInstructor());
        }

        return courseBatchRepository.save(existingBatch);
    }

    @Transactional(readOnly = true)
    public List<AssignableStudent> getAssignableStudents() {
        return enrollmentRepository.findAssignableStudents(Role.STUDENT);
    }

    @Transactional
    public void assignStudent(UUID batchId, UUID studentId) {

        CourseBatch batch = courseBatchRepository.findById(batchId)
                .orElseThrow(() ->
                        new RuntimeException("Batch not found with id: " + batchId)
                );

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with id: " + studentId)
                );

        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("User is not a student");
        }

        Optional<Enrollment> existingEnrollment =
                enrollmentRepository.findByIdUserIdAndIdBatchId(studentId, batchId);

        if (existingEnrollment.isPresent()) {

            Enrollment enrollment = existingEnrollment.get();

            if (!enrollment.isRemoved()) {
                throw new RuntimeException(
                        "Student is already assigned to this batch"
                );
            }

            enrollment.setRemoved(false);

            enrollmentRepository.save(enrollment);

            return;
        }

        Enrollment enrollment = new Enrollment();

        EnrollmentKey key = new EnrollmentKey();
        key.setUserId(studentId);
        key.setBatchId(batchId);

        enrollment.setId(key);
        enrollment.setUser(student);
        enrollment.setCourseBatch(batch);

        enrollment.setRemoved(false);

        enrollment.setStatus("ENROLLED");
        enrollment.setAmountPaid(BigDecimal.ZERO);
        enrollment.setPaymentStatus("UNPAID");
        enrollment.setDeliveryMode(batch.getAttendanceType());

        enrollmentRepository.save(enrollment);
    }


    @Transactional
    public void changeStudentBatch(
            UUID oldBatchId,
            UUID studentId,
            UUID newBatchId) {

        courseBatchRepository.findById(newBatchId)
                .orElseThrow(() -> new RuntimeException("New batch not found"));

        int updated = enrollmentRepository.changeStudentBatch(
                studentId,
                oldBatchId,
                newBatchId
        );

        if (updated == 0) {
            throw new RuntimeException(
                    "Enrollment record not found in the old batch"
            );
        }
    }

}