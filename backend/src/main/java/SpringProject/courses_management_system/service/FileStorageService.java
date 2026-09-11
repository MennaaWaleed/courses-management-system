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
            Paths.get("src/main/resources/static/resources/lecture-resources");

    private final ImageService imageService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public FileStorageService(ImageService imageService) {

        this.imageService = imageService;

        try {

            Files.createDirectories(contentDirectory);
            Files.createDirectories(courseImagesDirectory);
            Files.createDirectories(courseIconsDirectory);
            Files.createDirectories(lectureResourcesDirectory);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create upload directories",
                    e
            );
        }
    }


    // =========================================================
    // COURSE PDF
    // =========================================================

    public String saveContentFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Course PDF is required"
            );
        }

        String originalFileName =
                file.getOriginalFilename();

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + originalFileName;

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


    // =========================================================
    // COURSE IMAGE
    // =========================================================

    public String saveCourseImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Course image is required"
            );
        }

        try {

            // Compress + Resize + Convert to WebP
            byte[] webpImage =
                    imageService.compressToWebP(file);

            // Always save as WebP
            String fileName =
                    UUID.randomUUID() + ".webp";

            Path filePath =
                    courseImagesDirectory.resolve(fileName);

            Files.write(
                    filePath,
                    webpImage
            );

            return "/images/courses/images/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save course image",
                    e
            );
        }
    }


    // =========================================================
    // COURSE ICON
    // =========================================================

    public String saveCourseIcon(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {

            // Compress + Resize + Convert to WebP
            byte[] webpImage =
                    imageService.compressToWebP(file);

            // Always save as WebP
            String fileName =
                    UUID.randomUUID() + ".webp";

            Path filePath =
                    courseIconsDirectory.resolve(fileName);

            Files.write(
                    filePath,
                    webpImage
            );

            return "/images/courses/icons/" + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save course icon",
                    e
            );
        }
    }


    // =========================================================
    // LECTURE RESOURCE
    // =========================================================

    public String saveLectureResource(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "Lecture resource is required"
            );
        }

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new RuntimeException(
                    "Invalid lecture resource file name"
            );
        }

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + Paths.get(originalFileName)
                        .getFileName()
                        .toString();

        try {

            Path lectureResourcesDirectory =
                    Paths.get(
                            System.getProperty("user.dir"),
                            "src",
                            "main",
                            "resources",
                            "static",
                            "resources",
                            "lecture-resources"
                    );

            // Make sure directory exists
            Files.createDirectories(
                    lectureResourcesDirectory
            );

            Path filePath =
                    lectureResourcesDirectory.resolve(fileName);

            // Make sure parent exists
            Files.createDirectories(
                    filePath.getParent()
            );

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/resources/lecture-resources/"
                    + fileName;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save lecture resource",
                    e
            );
        }
    }


    // =========================================================
    // DELETE LECTURE RESOURCE
    // =========================================================

    public void deleteLectureResource(String fileUrl) {

        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {

            String prefix =
                    "/resources/lecture-resources/";

            if (!fileUrl.startsWith(prefix)) {
                return;
            }

            String fileName =
                    fileUrl.substring(prefix.length());

            Path filePath =
                    Paths.get(
                            "src/main/resources/static/resources/lecture-resources"
                    ).resolve(fileName);

            Files.deleteIfExists(filePath);

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete lecture resource file",
                    e
            );
        }
    }
}