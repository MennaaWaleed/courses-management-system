package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class UserCleanupService {

    private final UserRepository userRepository;

    // Runs every hour (3600000 milliseconds) to clean up expired unverified accounts
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredUnverifiedUsers() {
        userRepository.deleteByEnabledFalseAndVerificationCodeExpiryBefore(ZonedDateTime.now());
    }
}