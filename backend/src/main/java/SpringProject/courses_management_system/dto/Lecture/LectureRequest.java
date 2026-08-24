package SpringProject.courses_management_system.dto.Lecture;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class LectureRequest {

    private UUID batchId;

    private int lectureOrder;

    private String title;
}