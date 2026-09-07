package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.auth.Login.LoginRequest;
import SpringProject.courses_management_system.dto.auth.Login.LoginResponse;
import SpringProject.courses_management_system.dto.auth.Register.RegisterRequest;
import SpringProject.courses_management_system.dto.auth.Register.RegisterResponse;
import SpringProject.courses_management_system.dto.auth.SetPassword.SetPasswordRequest;
import SpringProject.courses_management_system.dto.auth.SetPassword.SetPasswordResponse;
import SpringProject.courses_management_system.dto.auth.VerifyEmail.VerifyEmailRequest;
import SpringProject.courses_management_system.dto.auth.VerifyEmail.VerifyEmailResponse;
import SpringProject.courses_management_system.model.Role;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.repository.UserRepository;
import SpringProject.courses_management_system.security.CustomUserDetails;
import SpringProject.courses_management_system.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is not verified. Please verify your email first.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );


        String token = jwtService.generateToken(new CustomUserDetails(user));

        LoginResponse response = new LoginResponse();
        response.setMessage("Login successful");
        response.setToken(token);
        response.setRole(user.getRole().name());

        return response;
    }

    public RegisterResponse register(RegisterRequest request) {

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            if (user.isEnabled()) {
                if (user.getPassword() == null) {
                    user.setEnabled(false);

                    String verificationCode = String.format("%06d", new java.util.Random().nextInt(1000000));
                    user.setVerificationCode(verificationCode);
                    user.setVerificationCodeExpiry(ZonedDateTime.now().plusMinutes(10));

                    userRepository.save(user);
                    emailService.sendVerificationCode(user.getEmail(), verificationCode);

                    throw new IllegalArgumentException("This email is not verified. A new verification code has been sent.");
                }

                throw new IllegalArgumentException("Email already exists.");
            }

            String verificationCode =
                    String.format("%06d", new java.util.Random().nextInt(1000000));

            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiry(
                    ZonedDateTime.now().plusMinutes(10)
            );

            userRepository.save(user);

            emailService.sendVerificationCode(
                    user.getEmail(),
                    verificationCode
            );

            throw new IllegalArgumentException(
                    "This email is not verified. A new verification code has been sent."
            );
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());



        user.setPhoneNumber(request.getPhone());

        user.setRole(Role.STUDENT);

        user.setEnabled(false);

        String verificationCode =
                String.format("%06d", new java.util.Random().nextInt(1000000));

        user.setVerificationCode(verificationCode);

        user.setVerificationCodeExpiry(
                ZonedDateTime.now().plusMinutes(10)
        );

        user.setCreatedAt(ZonedDateTime.now());
        user.setUpdatedAt(ZonedDateTime.now());

        userRepository.save(user);

        emailService.sendVerificationCode(
                user.getEmail(),
                verificationCode
        );

        RegisterResponse response = new RegisterResponse();

        response.setMessage(
                "Registration successful. Please check your email for the verification code."
        );

        return response;
    }

    public VerifyEmailResponse verifyEmail(VerifyEmailRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        if (user.isEnabled()) {
            if (user.getPassword() == null) {
                VerifyEmailResponse response = new VerifyEmailResponse();
                response.setMessage("Email verified successfully.");
                return response;
            }
            throw new IllegalArgumentException("Email is already verified.");
        }

        if (user.getVerificationCodeExpiry() == null ||
                user.getVerificationCodeExpiry()
                        .isBefore(ZonedDateTime.now())) {

            throw new IllegalArgumentException(
                    "Verification code has expired."
            );
        }

        if (user.getVerificationCode() == null ||
                !user.getVerificationCode().equals(request.getCode())) {

            throw new IllegalArgumentException(
                    "Invalid verification code."
            );
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);

        userRepository.save(user);

        VerifyEmailResponse response = new VerifyEmailResponse();
        response.setMessage("Email verified successfully.");

        return response;
    }

    public SetPasswordResponse setPassword(SetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        if (!user.isEnabled()) {
            throw new IllegalArgumentException(
                    "Please verify your email first."
            );
        }

        if (user.getPassword() != null) {
            throw new IllegalArgumentException(
                    "Password has already been set."
            );
        }

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        userRepository.save(user);

        String token = jwtService.generateToken(new CustomUserDetails(user));

        SetPasswordResponse response = new SetPasswordResponse();
        response.setMessage("Password set successfully.");
        response.setToken(token);
        response.setRole(user.getRole().name());

        return response;
    }
    public void resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email."));

        if (user.isEnabled()) {
            if (user.getPassword() != null) {
                throw new RuntimeException("Account is already verified. You can login directly.");
            }
        }

        String newCode =
                String.format("%06d", new java.util.Random().nextInt(1000000));

        user.setVerificationCode(newCode);
        user.setVerificationCodeExpiry(
                ZonedDateTime.now().plusMinutes(10)
        );
        userRepository.save(user);

        emailService.sendVerificationCode(user.getEmail(), newCode);
    }
}

