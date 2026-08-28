package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.LectureResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LectureResourceRepository
        extends JpaRepository<LectureResource, UUID> {

    List<LectureResource> findByLectureIdOrderByCreatedAtAsc(
            UUID lectureId
    );

    void deleteByLectureId(UUID lectureId);
}