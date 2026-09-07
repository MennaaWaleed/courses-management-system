package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.dto.auth.Login.LoginRequest;
import SpringProject.courses_management_system.dto.auth.Login.LoginResponse;
import SpringProject.courses_management_system.dto.auth.Register.RegisterRequest;
import SpringProject.courses_management_system.dto.auth.Register.RegisterResponse;
import SpringProject.courses_management_system.dto.auth.ResendCode.ResendCodeRequest;
import SpringProject.courses_management_system.dto.auth.SetPassword.SetPasswordRequest;
import SpringProject.courses_management_system.dto.auth.SetPassword.SetPasswordResponse;
import SpringProject.courses_management_system.dto.auth.VerifyEmail.VerifyEmailRequest;
import SpringProject.courses_management_system.dto.auth.VerifyEmail.VerifyEmailResponse;
import SpringProject.courses_management_system.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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

    @PostMapping("/verify-email")
    public ResponseEntity<VerifyEmailResponse> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {

        return ResponseEntity.ok(
                authenticationService.verifyEmail(request)
        );
    }

    @PostMapping("/set-password")
    public ResponseEntity<SetPasswordResponse> setPassword(
            @Valid @RequestBody SetPasswordRequest request) {

        return ResponseEntity.ok(
                authenticationService.setPassword(request)
        );
    }


    @PostMapping("/resend-code")
    public ResponseEntity<?> resendVerificationCode(@RequestBody ResendCodeRequest request) {
        try {
            authenticationService.resendVerificationCode(request.getEmail());

            return ResponseEntity.ok(Map.of("message", "A new verification code has been sent to your email."));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
