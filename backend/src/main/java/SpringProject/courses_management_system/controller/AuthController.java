package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.auth.LoginRequest;
import SpringProject.courses_management_system.dto.auth.LoginResponse;
import SpringProject.courses_management_system.dto.auth.RegisterRequest;
import SpringProject.courses_management_system.dto.auth.RegisterResponse;
import SpringProject.courses_management_system.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService  authenticationService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        return authenticationService.login(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(authenticationService.register(request));
    }
}
