package SpringProject.courses_management_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path contentDirectory =
            Paths.get("src/main/resources/static/contents/pdfs");

    private final Path courseImagesDirectory =
            Paths.get("src/main/resources/static/images/courses/images");

    private final Path courseIconsDirectory =
            Paths.get("src/main/resources/static/images/courses/icons");

    private final Path lectureResourcesDirectory =
            Paths.get( "src/main/resources/static/resources/lecture-resources");
    public FileStorageService() {

        try {
            Files.createDirectories(contentDirectory);
            Files.createDirectories(courseImagesDirectory);
            Files.createDirectories(courseIconsDirectory);

        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories", e);
        }
    }



    public String saveContentFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Course PDF is required"
            );
        }

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();

        try {

            Path filePath =
                    contentDirectory.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/contents/courses/CoursesContent/"
                    + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save course PDF",
                    e
            );
        }
    }

    public String saveCourseImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Course image is required");
        }

        String fileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {

            Path filePath = courseImagesDirectory.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/images/courses/images/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save course image", e);
        }
    }


    public String saveCourseIcon(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String fileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {

            Path filePath = courseIconsDirectory.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/images/courses/icons/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save course icon", e);
        }
    }


    public String saveLectureResource(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Lecture resource is required");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new RuntimeException("Invalid lecture resource file name");
        }

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + Paths.get(originalFileName)
                        .getFileName()
                        .toString();

        try {

            Path lectureResourcesDirectory = Paths.get(
                    System.getProperty("user.dir"),
                    "src",
                    "main",
                    "resources",
                    "static",
                    "resources",
                    "lecture-resources"
            );

            // تأكد إن الفولدر موجود
            Files.createDirectories(lectureResourcesDirectory);

            Path filePath =
                    lectureResourcesDirectory.resolve(fileName);

            // تأكد إن الـ parent موجود
            Files.createDirectories(filePath.getParent());

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/resources/lecture-resources/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save lecture resource",
                    e
            );
        }
    }

}