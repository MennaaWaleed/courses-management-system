package SpringProject.courses_management_system.controller;

import SpringProject.courses_management_system.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{courseId}")
    public ResponseEntity<String> addToWishlist(
            @PathVariable UUID courseId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        wishlistService.addToWishlist(email, courseId);

        return ResponseEntity.ok("Course added to wishlist");
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<String> removeFromWishlist(
            @PathVariable UUID courseId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        wishlistService.removeFromWishlist(email, courseId);

        return ResponseEntity.ok("Course removed from wishlist");
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<Boolean> isWishlisted(
            @PathVariable UUID courseId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        boolean wishlisted =
                wishlistService.isWishlisted(email, courseId);

        return ResponseEntity.ok(wishlisted);
    }
}