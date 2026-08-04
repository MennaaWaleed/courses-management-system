package SpringProject.courses_management_system.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
public class StudentController {
    @RequestMapping("/dashboard")
    @PreAuthorize(("hasRole('STUDENT')"))
    public String dashboard(){
        return "Welcome STUDENT";
    }
}
