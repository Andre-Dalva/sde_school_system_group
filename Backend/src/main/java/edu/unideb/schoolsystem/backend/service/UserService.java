package edu.unideb.schoolsystem.backend.service;

import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.model.ROLES;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       EmailService emailService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Registration
    public User createUser(User user) {

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Teachers start unverified
        if (user.getRole() == ROLES.TEACHER) {
            user.setVerified(false);
            user.setVerificationCode(null);
            user.setVerificationExpiresAt(null);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already taken.");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken.");
        }

        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Email or Username already in use");
        }
    }

    // Secure update: no role change, no raw password
    public User updateUser(Long id, User patch) {
        return userRepository.findById(id).map(user -> {

            if (patch.getName() != null)
                user.setName(patch.getName());

            // Check for email uniqueness (exclude current user)
            if (patch.getEmail() != null && !patch.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(patch.getEmail())) {
                    throw new RuntimeException("Email is already taken.");
                }
                user.setEmail(patch.getEmail());
            }

            // Check for username uniqueness (exclude current user)
            if (patch.getUsername() != null && !patch.getUsername().equals(user.getUsername())) {
                if (userRepository.existsByUsername(patch.getUsername())) {
                    throw new RuntimeException("Username is already taken.");
                }
                user.setUsername(patch.getUsername());
            }
            if (patch.getBirthDate() != null)
                user.setBirthDate(patch.getBirthDate());

            if (patch.getPassword() != null && !patch.getPassword().isBlank())
                user.setPassword(passwordEncoder.encode(patch.getPassword()));

            // Do NOT change role here
            // user.setRole(newUser.getRole());
            return userRepository.save(user);
        }).orElse(null);
    }

    // Admin approving teacher (sending verification code)
    private String generateTeacherCode() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private Date generateExpirationDate() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR, 72);
        return calendar.getTime();
    }

    public User verifyTeacher(Long teacherId) {
        User teacher = userRepository.findById(teacherId).orElse(null);
        if (teacher == null || teacher.getRole() != ROLES.TEACHER) return null;

        String code = generateTeacherCode();

        teacher.setVerificationCode(code);
        teacher.setVerificationExpiresAt(generateExpirationDate());
        teacher.setVerified(false); // stays false until code confirmed

        emailService.sendVerificationCode(teacher.getEmail(), teacher.getId(), code);

        return userRepository.save(teacher);
    }

    // Teacher confirms own verification (after receiving email code)
    public User confirmTeacherVerification(Long teacherId, String code) {
        User teacher = userRepository.findById(teacherId).orElse(null);
        if (teacher == null || teacher.getRole() != ROLES.TEACHER) return null;

        if (teacher.isVerified()) return teacher; // already verified

        if (!Objects.equals(teacher.getVerificationCode(), code)) return null;

        if (teacher.getVerificationExpiresAt().before(new Date())) return null; // expired code

        teacher.setVerified(true);
        teacher.setVerificationCode(null);
        teacher.setVerificationExpiresAt(null);

        return userRepository.save(teacher);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getUnverifiedTeachers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == ROLES.TEACHER && !u.isVerified())
                .toList();
    }

    // Students and teachers seeing their classes
    public Set<ClassEntity> getClassesForStudent(Long studentId) {
        User user = userRepository.findById(studentId).orElse(null);
        return user != null ? user.getClasses() : null;
    }
}
