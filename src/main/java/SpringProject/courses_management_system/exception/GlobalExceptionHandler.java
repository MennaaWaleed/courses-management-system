package SpringProject.courses_management_system.exception;

import SpringProject.courses_management_system.dto.auth.LoginResponse;
import SpringProject.courses_management_system.dto.auth.RegisterResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<LoginResponse> handleUserNotFound(
            UsernameNotFoundException ex) {

        LoginResponse response = new LoginResponse();
        response.setMessage("User not found. Please sign up.");

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<LoginResponse> handleBadCredentials(
            BadCredentialsException ex) {

        LoginResponse response = new LoginResponse();
        response.setMessage("Invalid email or password.");

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RegisterResponse> handleIllegalArgument(
            IllegalArgumentException ex) {

        RegisterResponse response = new RegisterResponse();
        response.setMessage(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

}
