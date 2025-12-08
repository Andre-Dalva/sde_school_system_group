package edu.unideb.schoolsystem.backend.dto;

import lombok.Data;

@Data
public class CreateClassDTO {
    private String title;
    private String roomId;
    private Long teacherId; // optional for teacher, required for admin
}