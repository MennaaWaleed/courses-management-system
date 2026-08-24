package SpringProject.courses_management_system.dto.Lecture;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class LectureResponse {

    private UUID id;

    private UUID batchId;

    private int lectureOrder;

    private String title;

    private boolean published;

    private List<LectureResourceResponse> resources;
}