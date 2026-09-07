package SpringProject.courses_management_system.validation;


import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StrongPasswordValidator
        implements ConstraintValidator<StrongPassword, String> {

    @Override
    public boolean isValid(
            String password,
            ConstraintValidatorContext context) {

        if (password == null || password.isBlank()) {
            return true;
        }

        if (password.length() < 8) {
            setMessage(
                    context,
                    "Password must be at least 8 characters."
            );
            return false;
        }

        if (!password.matches(".*[A-Z].*")) {
            setMessage(
                    context,
                    "Password must contain an uppercase letter."
            );
            return false;
        }

        if (!password.matches(".*[a-z].*")) {
            setMessage(
                    context,
                    "Password must contain a lowercase letter."
            );
            return false;
        }

        if (!password.matches(".*\\d.*")) {
            setMessage(
                    context,
                    "Password must contain a number."
            );
            return false;
        }

        if (!password.matches(".*[^a-zA-Z0-9].*")) {
            setMessage(
                    context,
                    "Password must contain a special character."
            );
            return false;
        }

        return true;
    }

    private void setMessage(
            ConstraintValidatorContext context,
            String message) {

        context.disableDefaultConstraintViolation();

        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }
}