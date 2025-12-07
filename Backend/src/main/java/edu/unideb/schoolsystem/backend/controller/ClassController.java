package edu.unideb.schoolsystem.backend.controller;

import edu.unideb.schoolsystem.backend.dto.ClassDTO;
import edu.unideb.schoolsystem.backend.dto.ClassForStudentDTO;
import edu.unideb.schoolsystem.backend.dto.CreateClassDTO;
import edu.unideb.schoolsystem.backend.dto.StudentInClassDTO;
import edu.unideb.schoolsystem.backend.mapper.DTOMapper;
import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.model.ROLES;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.repository.UserRepository;
import edu.unideb.schoolsystem.backend.service.ClassService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {
    private final UserRepository userRepository;

    private final ClassService classService;

    public ClassController(UserRepository userRepository, ClassService classService) {
        this.userRepository = userRepository;
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
    public ResponseEntity<ClassDTO> createClass(@RequestBody CreateClassDTO dto) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ClassEntity classEntity = new ClassEntity();
        classEntity.setTitle(dto.getTitle());
        classEntity.setRoomId(dto.getRoomId());
        classEntity.setDescription("default description");
        if (currentUser.getRole() == ROLES.TEACHER) {
            classEntity.setTeacher(currentUser);
        }

        if (currentUser.getRole() == ROLES.ADMIN) {
            if (dto.getTeacherId() == null) {
                return ResponseEntity.badRequest().body(null);
            }

            User teacher = userRepository.findById(dto.getTeacherId())
                    .orElse(null);

            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            classEntity.setTeacher(teacher);
        }
        ClassEntity created = classService.createClass(classEntity);


        if (created == null) return ResponseEntity.badRequest().build();

        return new ResponseEntity<>(DTOMapper.toClassDTO(created), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ClassDTO> updateClass(@PathVariable Long id, @RequestBody ClassEntity body) {
        ClassEntity existing = classService.getClassById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Admin can update anything
        if (currentUser.getRole() == ROLES.ADMIN) {
            ClassEntity updated = classService.updateClass(id, body);

            return ResponseEntity.ok(DTOMapper.toClassDTO(updated));
        }

        // Teacher can update ONLY their own class
        if (currentUser.getRole() == ROLES.TEACHER) {
            if (!existing.getTeacher().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).build();
            }
            ClassEntity updated = classService.updateClass(id, body);

            return ResponseEntity.ok(DTOMapper.toClassDTO(updated));
        }

        // Students cannot update classes
        return ResponseEntity.status(403).build();
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
    @PreAuthorize("hasRole('TEACHER') or (hasRole('STUDENT') and #studentId == principal.id)")
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
