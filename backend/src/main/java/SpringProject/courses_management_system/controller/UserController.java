package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.ProfileData.UserProfileResponse;
import SpringProject.courses_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}