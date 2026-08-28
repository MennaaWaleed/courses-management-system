package SpringProject.courses_management_system.repository;

import SpringProject.courses_management_system.model.CourseBatch;
import SpringProject.courses_management_system.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, UUID> {

    List<Lecture> findByCourseBatchOrderByLectureOrderAsc(
            CourseBatch courseBatch
    );

    List<Lecture> findByCourseBatchIdOrderByLectureOrderAsc(
            UUID batchId
    );

    List<Lecture> findByCourseBatchIdAndPublishedTrueOrderByLectureOrderAsc(
            UUID batchId
    );
}