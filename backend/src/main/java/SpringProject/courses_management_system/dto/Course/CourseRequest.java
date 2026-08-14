package SpringProject.courses_management_system.dto.Course;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class CourseRequest {
    private String courseName;
    private String description;
    private String shortDescription;

    private Set<UUID> categoryIds;

    private boolean published;
    private BigDecimal courseHours;
    private int lectureCount;
    private String imageUrl;
    private String iconUrl;
    private int price;
    private boolean featured;
    private String content_url;
}
