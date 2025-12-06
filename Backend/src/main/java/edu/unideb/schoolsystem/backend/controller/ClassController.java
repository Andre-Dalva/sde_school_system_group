package edu.unideb.schoolsystem.backend.controller;

import edu.unideb.schoolsystem.backend.dto.ClassDTO;
import edu.unideb.schoolsystem.backend.dto.ClassForStudentDTO;
import edu.unideb.schoolsystem.backend.dto.StudentInClassDTO;
import edu.unideb.schoolsystem.backend.mapper.DTOMapper;
import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.service.ClassService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    // 1) GET all classes (admin, teacher, student)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public List<ClassDTO> getAll() {
        return classService.getAllClasses().stream()
                .map(DTOMapper::toClassDTO)
                .toList();
    }

    // 2) GET one class (admin, teacher, student)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT')")
    public ResponseEntity<ClassDTO> getClassById(@PathVariable Long id) {
        ClassEntity entity = classService.getClassById(id);
        if (entity == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(DTOMapper.toClassDTO(entity));
    }

    // 3) CREATE class (teacher or admin)
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ClassDTO> createClass(@RequestBody ClassEntity classEntity) {
        ClassEntity created = classService.createClass(classEntity);
        if (created == null) return ResponseEntity.badRequest().build();
        return new ResponseEntity<>(DTOMapper.toClassDTO(created), HttpStatus.CREATED);
    }

    // 4) DELETE class (teacher or admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    // 5) ASSIGN TEACHER (admin only)
    @PostMapping("/{classId}/assign-teacher/{teacherId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassDTO> assignTeacher(
            @PathVariable Long classId,
            @PathVariable Long teacherId
    ) {
        ClassEntity updated = classService.assignTeacher(classId, teacherId);
        if (updated == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(DTOMapper.toClassDTO(updated));
    }

    // 6) ENROLL STUDENT (student only)
    @PostMapping("/{classId}/enroll/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ClassDTO> enrollStudent(
            @PathVariable Long classId,
            @PathVariable Long studentId
    ) {
        ClassEntity updated = classService.enrollStudent(classId, studentId);
        if (updated == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(DTOMapper.toClassDTO(updated));
    }

    // 7) GET class students (teacher or admin)
    @GetMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<StudentInClassDTO>> getStudents(@PathVariable Long id) {
        var students = classService.getStudentInClass(id);
        if (students == null) return ResponseEntity.notFound().build();

        List<StudentInClassDTO> dtos = students.stream()
                .map(DTOMapper::toStudentInClass)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
