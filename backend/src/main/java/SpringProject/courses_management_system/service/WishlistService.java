package SpringProject.courses_management_system.service;

import SpringProject.courses_management_system.model.Course;
import SpringProject.courses_management_system.model.User;
import SpringProject.courses_management_system.model.Wishlist;
import SpringProject.courses_management_system.model.WishlistKey;
import SpringProject.courses_management_system.repository.CourseRepository;
import SpringProject.courses_management_system.repository.UserRepository;
import SpringProject.courses_management_system.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public void addToWishlist(String email, UUID courseId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        boolean alreadyExists =
                wishlistRepository.existsByUserIdAndCourseId(
                        user.getId(),
                        courseId
                );

        if (alreadyExists) {
            throw new RuntimeException("Course is already in wishlist");
        }

        Wishlist wishlist = new Wishlist();

        WishlistKey key =
                new WishlistKey(user.getId(), courseId);

        wishlist.setId(key);
        wishlist.setUser(user);
        wishlist.setCourse(course);

        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(String email, UUID courseId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        wishlistRepository.deleteByUserIdAndCourseId(
                user.getId(),
                courseId
        );
    }

    public boolean isWishlisted(String email, UUID courseId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return wishlistRepository.existsByUserIdAndCourseId(
                user.getId(),
                courseId
        );
    }
}