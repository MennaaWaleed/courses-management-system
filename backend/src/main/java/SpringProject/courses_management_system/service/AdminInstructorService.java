package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.User.InstructorCreateRequest;
import SpringProject.courses_management_system.dto.User.InstructorResponse;
import SpringProject.courses_management_system.dto.User.InstructorUpdateRequest;
import SpringProject.courses_management_system.model.Role;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.repository.AdminInstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminInstructorService {

    private final AdminInstructorRepository adminInstructorRepository;
    private final PasswordEncoder passwordEncoder;

    public InstructorResponse createInstructor(InstructorCreateRequest request) {
        if (adminInstructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        User instructor = new User();
        instructor.setFirstName(request.getFirstName());
        instructor.setLastName(request.getLastName());
        instructor.setEmail(request.getEmail());
        instructor.setPhoneNumber(request.getPhoneNumber());
        instructor.setPassword(passwordEncoder.encode(request.getPassword()));
        instructor.setRole(Role.INSTRUCTOR);
        instructor.setEnabled(true);
        instructor.setCreatedAt(ZonedDateTime.now());
        instructor.setUpdatedAt(ZonedDateTime.now());

        User savedInstructor = adminInstructorRepository.save(instructor);
        return mapToResponse(savedInstructor);
    }

    public List<InstructorResponse> getAllInstructors() {
        return adminInstructorRepository.findByRoleAndIsDeletedFalseOrderByCreatedAtDesc(Role.INSTRUCTOR)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InstructorResponse> searchInstructors(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllInstructors();
        }
        return adminInstructorRepository.searchInstructors(Role.INSTRUCTOR, keyword.trim())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public InstructorResponse updateInstructor(UUID id, InstructorUpdateRequest request) {
        User instructor = getInstructorEntity(id);

        if (!instructor.getEmail().equalsIgnoreCase(request.getEmail()) &&
                adminInstructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use by another account.");
        }

        instructor.setFirstName(request.getFirstName());
        instructor.setLastName(request.getLastName());
        instructor.setEmail(request.getEmail());
        instructor.setPhoneNumber(request.getPhoneNumber());
        instructor.setUpdatedAt(ZonedDateTime.now());

        return mapToResponse(adminInstructorRepository.save(instructor));
    }

    public void changePassword(UUID id, String newPassword) {
        User instructor = getInstructorEntity(id);
        instructor.setPassword(passwordEncoder.encode(newPassword));
        instructor.setUpdatedAt(ZonedDateTime.now());
        adminInstructorRepository.save(instructor);
    }

    public InstructorResponse toggleStatus(UUID id) {
        User instructor = getInstructorEntity(id);
        instructor.setEnabled(!instructor.isEnabled());
        instructor.setUpdatedAt(ZonedDateTime.now());
        return mapToResponse(adminInstructorRepository.save(instructor));
    }

    public void deleteInstructor(UUID id) {
        User instructor = getInstructorEntity(id);

        instructor.setDeleted(true);

        adminInstructorRepository.save(instructor);
    }

    private User getInstructorEntity(UUID id) {
        User user = adminInstructorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        if (user.getRole() != Role.INSTRUCTOR) {
            throw new IllegalArgumentException("User is not an instructor");
        }
        return user;
    }

    private InstructorResponse mapToResponse(User user) {
        InstructorResponse response = new InstructorResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}