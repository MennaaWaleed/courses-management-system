package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.ProfileData.UserProfileResponse;
import SpringProject.courses_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import SpringProject.courses_management_system.dto.User.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        UserProfileResponse profile =
                userService.getUserProfile(email);

        return ResponseEntity.ok(profile);
    }
    @PutMapping("/profile/password")
    public ResponseEntity<?> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        // principal.getName() extracts the authenticated user's email from the JWT
        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }
}