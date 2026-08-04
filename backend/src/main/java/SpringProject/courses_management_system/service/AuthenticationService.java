package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.dto.auth.LoginRequest;
import SpringProject.courses_management_system.dto.auth.LoginResponse;
import SpringProject.courses_management_system.dto.auth.RegisterRequest;
import SpringProject.courses_management_system.dto.auth.RegisterResponse;
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
import java.time.Instant;
import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));


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

        return response;
    }
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setPhoneNumber(request.getPhone());

        user.setRole(Role.STUDENT);

        user.setEnabled(true);

        user.setCreatedAt(ZonedDateTime.now());
        user.setUpdatedAt(ZonedDateTime.now());

        userRepository.save(user);

        RegisterResponse response = new RegisterResponse();
        response.setMessage("Registration successful");

        return response;
    }
}

