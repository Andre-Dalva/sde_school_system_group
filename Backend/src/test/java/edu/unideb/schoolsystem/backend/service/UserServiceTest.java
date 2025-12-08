package edu.unideb.schoolsystem.backend.service;

import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.model.ROLES;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;


    // --------------------------------------------------------
    // getUser
    // --------------------------------------------------------
    @Test
    void getUser_shouldReturnUser_whenExists() {
        User u = new User();
        u.setId(1L);
        u.setUsername("test");

        when(userRepository.findById(1L)).thenReturn(Optional.of(u));

        User result = userService.getUser(1L);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("test");
    }

    @Test
    void getUser_shouldReturnNull_whenNotExists() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        User result = userService.getUser(99L);

        assertThat(result).isNull();
    }


    // --------------------------------------------------------
    // createUser
    // --------------------------------------------------------
    @Test
    void createUser_shouldEncodePassword_andSaveUser() {
        User newUser = new User();
        newUser.setUsername("alice");
        newUser.setEmail("alice@mail.com");
        newUser.setPassword("plain");
        newUser.setRole(ROLES.STUDENT);

        when(passwordEncoder.encode("plain")).thenReturn("encodedPass");
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(10L);
            return u;
        });

        User saved = userService.createUser(newUser);

        assertThat(saved.getId()).isEqualTo(10L);
        assertThat(saved.getPassword()).isEqualTo("encodedPass");
    }

    @Test
    void createUser_shouldRejectDuplicateEmail() {
        User u = new User();
        u.setEmail("taken@mail.com");
        u.setUsername("user");
        u.setPassword("123");

        when(userRepository.existsByEmail("taken@mail.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> userService.createUser(u));
    }

    @Test
    void createUser_shouldRejectDuplicateUsername() {
        User u = new User();
        u.setEmail("free@mail.com");
        u.setUsername("taken");
        u.setPassword("123");

        when(userRepository.existsByEmail("free@mail.com")).thenReturn(false);
        when(userRepository.existsByUsername("taken")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> userService.createUser(u));
    }

    @Test
    void createUser_shouldHandleUniqueConstraintError() {
        User u = new User();
        u.setEmail("email@mail.com");
        u.setUsername("john");
        u.setPassword("123");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.save(any())).thenThrow(DataIntegrityViolationException.class);

        assertThrows(RuntimeException.class, () -> userService.createUser(u));
    }


    // --------------------------------------------------------
    // updateUser
    // --------------------------------------------------------
    @Test
    void updateUser_shouldUpdateFields() {
        User existing = new User();
        existing.setId(5L);
        existing.setEmail("old@mail.com");
        existing.setUsername("oldUser");
        existing.setPassword("oldPass");

        User patch = new User();
        patch.setEmail("new@mail.com");
        patch.setUsername("newUser");
        patch.setPassword("newPass");

        when(userRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByEmail("new@mail.com")).thenReturn(false);
        when(userRepository.existsByUsername("newUser")).thenReturn(false);
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNewPass");
        when(userRepository.save(any(User.class))).thenReturn(existing);

        User updated = userService.updateUser(5L, patch);

        assertThat(updated.getEmail()).isEqualTo("new@mail.com");
        assertThat(updated.getUsername()).isEqualTo("newUser");
        assertThat(updated.getPassword()).isEqualTo("encodedNewPass");
    }


    // --------------------------------------------------------
    // verifyTeacher
    // --------------------------------------------------------
    @Test
    void verifyTeacher_shouldGenerateCode_andSendEmail() {
        User teacher = new User();
        teacher.setId(50L);
        teacher.setRole(ROLES.TEACHER);
        teacher.setEmail("teach@mail.com");

        when(userRepository.findById(50L)).thenReturn(Optional.of(teacher));
        when(userRepository.save(any())).thenReturn(teacher);

        User result = userService.verifyTeacher(50L);

        assertNotNull(result.getVerificationCode());
        assertNotNull(result.getVerificationExpiresAt());
        assertFalse(result.isVerified());

        verify(emailService).sendVerificationCode(eq("teach@mail.com"), eq(50L), anyString());
    }

    @Test
    void verifyTeacher_shouldReturnNull_ifNotTeacher() {
        User student = new User();
        student.setId(10L);
        student.setRole(ROLES.STUDENT);

        when(userRepository.findById(10L)).thenReturn(Optional.of(student));

        User result = userService.verifyTeacher(10L);

        assertNull(result);
    }


    // --------------------------------------------------------
    // confirmTeacherVerification
    // --------------------------------------------------------
    @Test
    void confirmTeacherVerification_shouldVerifyTeacher_whenCodeMatches() {
        User teacher = new User();
        teacher.setId(40L);
        teacher.setRole(ROLES.TEACHER);
        teacher.setVerificationCode("abcd1234");
        teacher.setVerificationExpiresAt(new Date(System.currentTimeMillis() + 10000)); // future

        when(userRepository.findById(40L)).thenReturn(Optional.of(teacher));
        when(userRepository.save(any())).thenReturn(teacher);

        User result = userService.confirmTeacherVerification(40L, "abcd1234");

        assertTrue(result.isVerified());
        assertNull(result.getVerificationCode());
        assertNull(result.getVerificationExpiresAt());
    }

    @Test
    void confirmTeacherVerification_shouldReturnNull_ifCodeWrong() {
        User teacher = new User();
        teacher.setId(41L);
        teacher.setRole(ROLES.TEACHER);
        teacher.setVerificationCode("correct");
        teacher.setVerificationExpiresAt(new Date(System.currentTimeMillis() + 10000));

        when(userRepository.findById(41L)).thenReturn(Optional.of(teacher));

        User result = userService.confirmTeacherVerification(41L, "wrong");

        assertNull(result);
    }


    // --------------------------------------------------------
    // deleteUser
    // --------------------------------------------------------
    @Test
    void deleteUser_shouldCallRepository() {
        userService.deleteUser(5L);
        verify(userRepository).deleteById(5L);
    }


    // --------------------------------------------------------
    // getUnverifiedTeachers
    // --------------------------------------------------------
    @Test
    void getUnverifiedTeachers_shouldReturnOnlyTeachersNotVerified() {
        User t1 = new User();
        t1.setRole(ROLES.TEACHER);
        t1.setVerified(false);

        User t2 = new User();
        t2.setRole(ROLES.TEACHER);
        t2.setVerified(true);

        User s1 = new User();
        s1.setRole(ROLES.STUDENT);

        when(userRepository.findAll()).thenReturn(List.of(t1, t2, s1));

        List<User> result = userService.getUnverifiedTeachers();

        assertThat(result).containsExactly(t1);
    }


    // --------------------------------------------------------
    // getClassesForStudent
    // --------------------------------------------------------
    @Test
    void getClassesForStudent_shouldReturnClasses() {
        ClassEntity c = new ClassEntity();
        c.setId(1L);

        User student = new User();
        student.setId(100L);

        Set<ClassEntity> classes = new HashSet<>();
        classes.add(c);

        student.setClasses(classes);

        when(userRepository.findById(100L)).thenReturn(Optional.of(student));

        Set<ClassEntity> result = userService.getClassesForStudent(100L);

        assertThat(result).containsExactly(c);
    }

    @Test
    void getClassesForStudent_shouldReturnNull_ifUserNotFound() {
        when(userRepository.findById(200L)).thenReturn(Optional.empty());

        Set<ClassEntity> result = userService.getClassesForStudent(200L);

        assertNull(result);
    }
}
