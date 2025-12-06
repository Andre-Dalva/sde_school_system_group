package edu.unideb.schoolsystem.backend.mapper;

import edu.unideb.schoolsystem.backend.dto.ClassDTO;
import edu.unideb.schoolsystem.backend.dto.ClassForStudentDTO;
import edu.unideb.schoolsystem.backend.dto.StudentInClassDTO;
import edu.unideb.schoolsystem.backend.dto.UserDTO;
import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.model.User;

import java.util.Calendar;

public class DTOMapper {
    public static UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setBirthDate(user.getBirthDate());
        return dto;
    }

    public static ClassDTO toClassDTO(ClassEntity classEntity) {
        ClassDTO dto = new ClassDTO();
        dto.setId(classEntity.getId());
        dto.setTitle(classEntity.getTitle());
        dto.setDescription(classEntity.getDescription());
        dto.setRoomId(classEntity.getRoomId());
        dto.setTeacherId(classEntity.getTeacher() != null ? classEntity.getTeacher().getId() : null);
        return dto;
    }

    public static StudentInClassDTO toStudentInClass(User user) {
        StudentInClassDTO dto = new StudentInClassDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        return dto;
    }

    public static ClassForStudentDTO toClassForStudent(ClassEntity classEntity) {
        ClassForStudentDTO dto = new ClassForStudentDTO();
        dto.setId(classEntity.getId());
        dto.setTitle(classEntity.getTitle());
        dto.setRoomId(classEntity.getRoomId());
        return dto;
    }



}
