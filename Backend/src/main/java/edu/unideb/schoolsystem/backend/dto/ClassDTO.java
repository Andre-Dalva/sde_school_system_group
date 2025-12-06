package edu.unideb.schoolsystem.backend.dto;

import lombok.Data;

@Data
public class ClassDTO {
    private Long id;
    private String title;
    private String description;
    private String roomId;
    private Long teacherId;
}
