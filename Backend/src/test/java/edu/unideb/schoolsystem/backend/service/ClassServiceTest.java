package edu.unideb.schoolsystem.backend.service;

import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.model.ROLES;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.repository.ClassRepository;
import edu.unideb.schoolsystem.backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClassServiceTest {

    @Mock
    private ClassRepository classRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClassService classService;

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    // ---------------------------------------------------------
    // getAllClasses
    // ---------------------------------------------------------
    @Test
    void getAllClasses_shouldReturnList() {
        ClassEntity c1 = new ClassEntity();
        ClassEntity c2 = new ClassEntity();
        when(classRepository.findAll()).thenReturn(List.of(c1, c2));

        List<ClassEntity> result = classService.getAllClasses();

        assertThat(result).hasSize(2);
    }

    // ---------------------------------------------------------
    // getClassById
    // ---------------------------------------------------------
    @Test
    void getClassById_shouldReturnClass() {
        ClassEntity c = new ClassEntity();
        c.setId(1L);

        when(classRepository.findById(1L)).thenReturn(Optional.of(c));

        ClassEntity result = classService.getClassById(1L);

        assertThat(result).isEqualTo(c);
    }

    @Test
    void getClassById_shouldReturnNull_ifNotFound() {
        when(classRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(classService.getClassById(99L)).isNull();
    }

    // ---------------------------------------------------------
    // createClass
    // ---------------------------------------------------------
    @Test
    void createClass_shouldFail_ifTeacherNotVerified() {
        User teacher = new User();
        teacher.setId(5L);
        teacher.setVerified(false);

        ClassEntity ce = new ClassEntity();
        ce.setTeacher(teacher);

        when(userRepository.findById(5L)).thenReturn(Optional.of(teacher));

        assertThat(classService.createClass(ce)).isNull();
    }

    @Test
    void createClass_shouldSave_ifTeacherVerified() {
        User teacher = new User();
        teacher.setId(5L);
        teacher.setVerified(true);

        ClassEntity ce = new ClassEntity();
        ce.setTeacher(teacher);

        when(userRepository.findById(5L)).thenReturn(Optional.of(teacher));
        when(classRepository.save(any())).thenAnswer(inv -> {
            ClassEntity c = inv.getArgument(0);
            c.setId(10L);
            return c;
        });

        ClassEntity result = classService.createClass(ce);

        assertThat(result.getId()).isEqualTo(10L);
    }

    // ---------------------------------------------------------
    // updateClass
    // ---------------------------------------------------------
    @Test
    void updateClass_shouldUpdateFields() {
        ClassEntity existing = new ClassEntity();
        existing.setId(1L);

        ClassEntity patch = new ClassEntity();
        patch.setTitle("New Title");
        patch.setDescription("New Desc");
        patch.setRoomId("A201");

        when(classRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(classRepository.save(any())).thenReturn(existing);

        ClassEntity updated = classService.updateClass(1L, patch);

        assertThat(updated.getTitle()).isEqualTo("New Title");
        assertThat(updated.getDescription()).isEqualTo("New Desc");
        assertThat(updated.getRoomId()).isEqualTo("A201");
    }

    @Test
    void updateClass_shouldReturnNull_whenNotExists() {
        when(classRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(classService.updateClass(99L, new ClassEntity())).isNull();
    }

    // ---------------------------------------------------------
    // deleteClass
    // ---------------------------------------------------------
    @Test
    void deleteClass_shouldCallRepository() {
        classService.deleteClass(5L);
        verify(classRepository).deleteById(5L);
    }

    // ---------------------------------------------------------
    // assignTeacher
    // ---------------------------------------------------------
    @Test
    void assignTeacher_shouldWork_whenValidTeacher() {
        ClassEntity ce = new ClassEntity();
        ce.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(ROLES.TEACHER);

        when(classRepository.findById(1L)).thenReturn(Optional.of(ce));
        when(userRepository.findById(2L)).thenReturn(Optional.of(teacher));
        when(classRepository.save(any())).thenReturn(ce);

        ClassEntity result = classService.assignTeacher(1L, 2L);

        assertThat(result.getTeacher()).isEqualTo(teacher);
    }

    @Test
    void assignTeacher_shouldReturnNull_ifTeacherNotRoleTeacher() {
        ClassEntity ce = new ClassEntity();
        ce.setId(1L);

        User student = new User();
        student.setId(3L);
        student.setRole(ROLES.STUDENT);

        when(classRepository.findById(1L)).thenReturn(Optional.of(ce));
        when(userRepository.findById(3L)).thenReturn(Optional.of(student));

        assertThat(classService.assignTeacher(1L, 3L)).isNull();
    }

    // ---------------------------------------------------------
    // enrollStudent (SecurityContext logic!!!)
    // ---------------------------------------------------------
    private void mockSecurity(User principal) {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(principal, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    void enrollStudent_shouldAllowStudent_toEnrollSelf() {
        // student
        User student = new User();
        student.setId(2L);
        student.setRole(ROLES.STUDENT);

        // current user is same student
        mockSecurity(student);

        ClassEntity ce = new ClassEntity();
        ce.setId(1L);
        ce.setTeacher(new User()); // teacher irrelevant
        ce.setStudents(new HashSet<>());

        when(classRepository.findById(1L)).thenReturn(Optional.of(ce));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(classRepository.save(any())).thenReturn(ce);

        ClassEntity result = classService.enrollStudent(1L, 2L);

        assertThat(result.getStudents()).contains(student);
    }

    @Test
    void enrollStudent_shouldAllowTeacher_toEnrollTheirOwnStudent() {
        // teacher
        User teacher = new User();
        teacher.setId(5L);
        teacher.setRole(ROLES.TEACHER);

        mockSecurity(teacher);

        // class owned by teacher
        ClassEntity ce = new ClassEntity();
        ce.setId(1L);
        ce.setTeacher(teacher);
        ce.setStudents(new HashSet<>());

        // student
        User student = new User();
        student.setId(9L);
        student.setRole(ROLES.STUDENT);

        when(classRepository.findById(1L)).thenReturn(Optional.of(ce));
        when(userRepository.findById(9L)).thenReturn(Optional.of(student));
        when(classRepository.save(any())).thenReturn(ce);

        ClassEntity result = classService.enrollStudent(1L, 9L);

        assertThat(result.getStudents()).contains(student);
    }

    @Test
    void enrollStudent_shouldRejectTeacher_enrollingIntoForeignClass() {
        User teacher = new User();
        teacher.setId(5L);
        teacher.setRole(ROLES.TEACHER);

        mockSecurity(teacher);

        // class owned by someone else
        User otherTeacher = new User();
        otherTeacher.setId(100L);

        ClassEntity ce = new ClassEntity();
        ce.setTeacher(otherTeacher);

        when(classRepository.findById(1L)).thenReturn(Optional.of(ce));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(teacher));

        assertThat(classService.enrollStudent(1L, 5L)).isNull();
    }

    @Test
    void enrollStudent_shouldRejectAdmin() {
        User admin = new User();
        admin.setId(1L);
        admin.setRole(ROLES.ADMIN);

        mockSecurity(admin);

        ClassEntity ce = new ClassEntity();
        ce.setTeacher(new User());

        when(classRepository.findById(anyLong())).thenReturn(Optional.of(ce));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(admin));

        assertThat(classService.enrollStudent(1L, 1L)).isNull();
    }

    // ---------------------------------------------------------
    // getStudentInClass
    // ---------------------------------------------------------
    @Test
    void getStudentInClass_shouldReturnStudents() {
        User s = new User();
        Set<User> set = Set.of(s);

        ClassEntity ce = new ClassEntity();
        ce.setStudents(set);

        when(classRepository.findById(1L)).thenReturn(Optional.of(ce));

        assertThat(classService.getStudentInClass(1L)).containsExactly(s);
    }

    @Test
    void getStudentInClass_shouldReturnNull_whenClassNotFound() {
        when(classRepository.findById(99L)).thenReturn(Optional.empty());

        assertThat(classService.getStudentInClass(99L)).isNull();
    }
}
