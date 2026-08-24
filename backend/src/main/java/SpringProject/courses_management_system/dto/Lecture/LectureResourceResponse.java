package SpringProject.courses_management_system.dto.Lecture;

import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
public class LectureResourceResponse {

    private UUID id;

    private UUID lectureId;

    private String name;

    private String fileUrl;

    private String previewUrl;

    private Long size;

    private String type;

    private String source;

    private ZonedDateTime createdAt;
}