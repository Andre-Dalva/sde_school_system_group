package edu.unideb.schoolsystem.backend.dto;

import edu.unideb.schoolsystem.backend.model.ROLES;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String username;
    private String email;
    private LocalDate birthDate;
    private ROLES role;
}
