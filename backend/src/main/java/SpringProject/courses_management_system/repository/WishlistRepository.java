package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.Wishlist;
import SpringProject.courses_management_system.model.WishlistKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<Wishlist, WishlistKey> {

    @Query("""
        SELECT w
        FROM Wishlist w
        WHERE w.id.userId = :userId
    """)
    List<Wishlist> findByUserId(@Param("userId") UUID userId);


    @Query("""
        SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END
        FROM Wishlist w
        WHERE w.id.userId = :userId
        AND w.id.courseId = :courseId
    """)
    boolean existsByUserIdAndCourseId(
            @Param("userId") UUID userId,
            @Param("courseId") UUID courseId
    );


    @Modifying
    @Query("""
        DELETE FROM Wishlist w
        WHERE w.id.userId = :userId
        AND w.id.courseId = :courseId
    """)
    void deleteByUserIdAndCourseId(
            @Param("userId") UUID userId,
            @Param("courseId") UUID courseId
    );
}