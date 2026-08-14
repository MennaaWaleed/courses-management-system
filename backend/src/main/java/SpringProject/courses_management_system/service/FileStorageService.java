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
            Paths.get("src/main/resources/static/images/courses/CoursesContent");

    private final Path courseImagesDirectory =
            Paths.get("src/main/resources/static/images/courses/images");

    private final Path courseIconsDirectory =
            Paths.get("src/main/resources/static/images/courses/icons");


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
            throw new RuntimeException("Course PDF is required");
        }

        String fileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {

            Path filePath = contentDirectory.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/images/CoursesContent/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save course PDF", e);
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
}