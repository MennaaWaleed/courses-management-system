package SpringProject.courses_management_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

@Service
public class ImageService {

    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 1200;

    private static final float QUALITY = 0.82f;

    public byte[] compressToWebP(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image is empty");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Image size must be less than 10 MB"
            );
        }

        BufferedImage originalImage =
                ImageIO.read(file.getInputStream());

        if (originalImage == null) {
            throw new IllegalArgumentException(
                    "Invalid image file"
            );
        }

        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();

        // Calculate resize scale
        double scale = Math.min(
                (double) MAX_WIDTH / originalWidth,
                (double) MAX_HEIGHT / originalHeight
        );

        // Never enlarge small images
        if (scale > 1) {
            scale = 1;
        }

        int newWidth =
                Math.max(1, (int) Math.round(originalWidth * scale));

        int newHeight =
                Math.max(1, (int) Math.round(originalHeight * scale));


        /*
         * Preserve transparency.
         *
         * TYPE_INT_ARGB contains:
         * Alpha + Red + Green + Blue
         *
         * This is important for PNG icons with transparent backgrounds.
         */
        BufferedImage resizedImage =
                new BufferedImage(
                        newWidth,
                        newHeight,
                        BufferedImage.TYPE_INT_ARGB
                );

        Graphics2D graphics =
                resizedImage.createGraphics();

        // High quality resizing
        graphics.setRenderingHint(
                RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BICUBIC
        );

        graphics.setRenderingHint(
                RenderingHints.KEY_RENDERING,
                RenderingHints.VALUE_RENDER_QUALITY
        );

        graphics.setRenderingHint(
                RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON
        );

        /*
         * Draw the image directly.
         *
         * Since the target is ARGB,
         * transparency is preserved.
         */
        graphics.drawImage(
                originalImage,
                0,
                0,
                newWidth,
                newHeight,
                null
        );

        graphics.dispose();


        // Find WebP writer
        Iterator<ImageWriter> writers =
                ImageIO.getImageWritersByFormatName("webp");

        if (!writers.hasNext()) {
            throw new IllegalStateException(
                    "No WebP ImageWriter found"
            );
        }

        ImageWriter writer = writers.next();

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        try (
                ImageOutputStream imageOutputStream =
                        ImageIO.createImageOutputStream(outputStream)
        ) {

            writer.setOutput(imageOutputStream);

            ImageWriteParam writeParam =
                    writer.getDefaultWriteParam();

            if (writeParam.canWriteCompressed()) {

                writeParam.setCompressionMode(
                        ImageWriteParam.MODE_EXPLICIT
                );

                String[] compressionTypes =
                        writeParam.getCompressionTypes();

                if (compressionTypes != null &&
                        compressionTypes.length > 0) {

                    writeParam.setCompressionType(
                            compressionTypes[0]
                    );
                }

                writeParam.setCompressionQuality(
                        QUALITY
                );
            }if (writeParam.canWriteCompressed()) {

                writeParam.setCompressionMode(
                        ImageWriteParam.MODE_EXPLICIT
                );

                String[] compressionTypes =
                        writeParam.getCompressionTypes();

                if (compressionTypes != null &&
                        compressionTypes.length > 0) {

                    writeParam.setCompressionType(
                            compressionTypes[0]
                    );
                }

                writeParam.setCompressionQuality(
                        QUALITY
                );
            }

            writer.write(
                    null,
                    new IIOImage(
                            resizedImage,
                            null,
                            null
                    ),
                    writeParam
            );

        } finally {
            writer.dispose();
        }

        return outputStream.toByteArray();
    }
}