package SpringProject.courses_management_system.dto.ProfileData;

import java.util.List;

public record UserProfileResponse(
        String firstName,
        String lastName,
        String email,
        String phone,
        String role,
        List<EnrolledCourseResponse> enrolledCourses,
        List<WishlistCourseResponse> wishlist,
        List<AssignedBatchResponse> assignedBatches
) {}