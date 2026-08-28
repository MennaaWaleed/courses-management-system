package SpringProject.courses_management_system.dto.Lecture;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class LectureReorderRequest {

    private UUID batchId;

    private List<UUID> lectureIds;
}