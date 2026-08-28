package SpringProject.courses_management_system.dto.Lecture;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LectureResourceUpdateRequest {

    private String name;

    private String type;

    private String fileUrl;
}