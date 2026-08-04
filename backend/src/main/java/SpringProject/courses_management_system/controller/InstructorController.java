package SpringProject.courses_management_system.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/instructor")
public class InstructorController {

    @RequestMapping("/dashboard")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public String dashboard(){
        return "Welcome INSTRUCTOR";
    }
}
