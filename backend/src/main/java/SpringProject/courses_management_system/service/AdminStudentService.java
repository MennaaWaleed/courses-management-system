package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.AdminStudent.AdminStudentCourseResponse;
import SpringProject.courses_management_system.dto.AdminStudent.AdminStudentDetailsResponse;
import SpringProject.courses_management_system.dto.AdminStudent.AdminStudentResponse;
import SpringProject.courses_management_system.dto.AdminStudent.AvailableBatchResponse;
import SpringProject.courses_management_system.model.CourseBatch;
import SpringProject.courses_management_system.model.Enrollment;
import SpringProject.courses_management_system.model.Role;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.repository.CourseBatchRepository;
import SpringProject.courses_management_system.repository.EnrollmentRepository;
import SpringProject.courses_management_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminStudentService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseBatchRepository courseBatchRepository;

    public AdminStudentService(
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            CourseBatchRepository courseBatchRepository
    ) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.courseBatchRepository = courseBatchRepository;
    }


    public List<AdminStudentResponse> getAllStudents() {

        List<User> students =
                userRepository.findByRoleAndIsDeletedFalse(Role.STUDENT);

        return students.stream()
                .map(student -> {

                    long enrolledCourses =
                            enrollmentRepository
                                    .findActiveEnrollmentsByUserId(student.getId())
                                    .size();

                    return new AdminStudentResponse(
                            student.getId(),
                            student.getFirstName(),
                            student.getLastName(),
                            student.getFirstName() + " " + student.getLastName(),
                            student.getEmail(),
                            student.getPhoneNumber(),
                            student.isEnabled(),
                            enrolledCourses
                    );
                })
                .toList();
    }


    public AdminStudentDetailsResponse getStudentDetails(UUID studentId) {

        User student = getStudent(studentId);

        List<Enrollment> enrollments =
                enrollmentRepository.findActiveEnrollmentsWithDetails(studentId);

        List<AdminStudentCourseResponse> courses =
                enrollments.stream()
                        .map(enrollment -> {

                            CourseBatch batch =
                                    enrollment.getCourseBatch();

                            String instructorName =
                                    batch.getInstructor().getFirstName()
                                            + " "
                                            + batch.getInstructor().getLastName();

                            return new AdminStudentCourseResponse(
                                    batch.getCourse().getId(),
                                    batch.getCourse().getCourseName(),

                                    batch.getId(),
                                    batch.getBatchName(),

                                    batch.getInstructor().getId(),
                                    instructorName,

                                    enrollment.getStatus(),
                                    enrollment.getPaymentStatus(),

                                    enrollment.getEnrolledAt(),

                                    batch.getStartDate(),
                                    batch.getEndDate()
                            );
                        })
                        .toList();

        return new AdminStudentDetailsResponse(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getFirstName() + " " + student.getLastName(),
                student.getEmail(),
                student.getPhoneNumber(),
                student.isEnabled(),
                courses
        );
    }


    public List<AvailableBatchResponse> getAvailableBatches(
            UUID studentId,
            UUID courseId
    ) {

        getStudent(studentId);

        List<CourseBatch> batches =
                courseBatchRepository.findBatchesByCourseId(courseId);

        return batches.stream()
                .filter(batch -> !batch.isDeleted())
                .map(batch -> {

                    long enrolledStudents =
                            enrollmentRepository
                                    .countActiveStudentsInBatch(batch.getId());

                    String instructorName =
                            batch.getInstructor().getFirstName()
                                    + " "
                                    + batch.getInstructor().getLastName();

                    return new AvailableBatchResponse(
                            batch.getId(),
                            batch.getBatchName(),
                            batch.getCourse().getCourseName(),
                            instructorName,
                            batch.getStatus(),
                            batch.getCapacity(),
                            enrolledStudents,
                            batch.getStartDate(),
                            batch.getEndDate()
                    );
                })
                .toList();
    }


    @Transactional
    public void changeStudentBatch(
            UUID studentId,
            UUID currentBatchId,
            UUID newBatchId
    ) {

        User student = getStudent(studentId);

        CourseBatch currentBatch =
                courseBatchRepository
                        .findByIdAndDeletedFalse(currentBatchId)
                        .orElseThrow(() ->
                                new RuntimeException("Current batch not found")
                        );

        CourseBatch newBatch =
                courseBatchRepository
                        .findByIdAndDeletedFalse(newBatchId)
                        .orElseThrow(() ->
                                new RuntimeException("New batch not found")
                        );


        Enrollment enrollment =
                enrollmentRepository
                        .findByUserIdAndBatchId(
                                studentId,
                                currentBatchId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student is not enrolled in the current batch"
                                )
                        );


        if (!currentBatch.getCourse().getId()
                .equals(newBatch.getCourse().getId())) {

            throw new RuntimeException(
                    "You can only change the student to another batch of the same course"
            );
        }


        if (currentBatchId.equals(newBatchId)) {
            throw new RuntimeException(
                    "Student is already enrolled in this batch"
            );
        }


        boolean alreadyEnrolled =
                enrollmentRepository
                        .existsByUserIdAndCourseBatchIdAndRemovedFalse(
                                studentId,
                                newBatchId
                        );

        if (alreadyEnrolled) {
            throw new RuntimeException(
                    "Student is already enrolled in the selected batch"
            );
        }


        long enrolledStudents =
                enrollmentRepository
                        .countActiveStudentsInBatch(newBatchId);

        if (enrolledStudents >= newBatch.getCapacity()) {
            throw new RuntimeException(
                    "The selected batch is full"
            );
        }


        int updated =
                enrollmentRepository.updateStudentBatch(
                        studentId,
                        currentBatchId,
                        newBatchId
                );

        if (updated == 0) {
            throw new RuntimeException(
                    "Failed to change student batch"
            );
        }
    }

    @Transactional
    public void removeStudentFromBatch(
            UUID studentId,
            UUID batchId
    ) {

        getStudent(studentId);

        Enrollment enrollment =
                enrollmentRepository
                        .findByUserIdAndBatchId(
                                studentId,
                                batchId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Enrollment not found"
                                )
                        );

        if (enrollment.isRemoved()) {
            throw new RuntimeException(
                    "Student is already removed from this batch"
            );
        }

        enrollment.setRemoved(true);

        enrollmentRepository.save(enrollment);
    }


    private User getStudent(UUID studentId) {

        User student =
                userRepository
                        .findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"
                                )
                        );

        if (student.isDeleted()) {
            throw new RuntimeException(
                    "Student not found"
            );
        }

        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException(
                    "The selected user is not a student"
            );
        }

        return student;
    }

    @Transactional
    public void updateStudentEnabled(UUID studentId, boolean enabled) {

        int updated = userRepository.updateStudentEnabled(
                studentId,
                Role.STUDENT,
                enabled
        );

        if (updated == 0) {
            throw new RuntimeException("Student not found");
        }
    }
}