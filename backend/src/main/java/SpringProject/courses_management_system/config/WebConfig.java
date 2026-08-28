package SpringProject.courses_management_system.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:images/", "file:src/main/resources/static/images/");

        // Expose all potential local upload directories so they load instantly
        registry.addResourceHandler("/resources/**")
                .addResourceLocations(
                        "file:resources/",
                        "file:uploads/",
                        "file:files/",
                        "file:lecture-resources/",
                        "file:src/main/resources/static/resources/"
                );

        registry.addResourceHandler("/contents/courses/CoursesContent/**")
                .addResourceLocations("file:src/main/resources/static/contents/pdfs/");
    }
}