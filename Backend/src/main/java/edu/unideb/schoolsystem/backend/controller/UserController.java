package edu.unideb.schoolsystem.backend.controller;

import edu.unideb.schoolsystem.backend.dto.ClassForStudentDTO;
import edu.unideb.schoolsystem.backend.dto.UserDTO;
import edu.unideb.schoolsystem.backend.mapper.DTOMapper;
import edu.unideb.schoolsystem.backend.model.ROLES;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // 1) ADMIN – list all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getAll() {
        return userService.getAllUsers().stream()
                .map(DTOMapper::toUserDTO)
                .toList();
    }

    // 2) ADMIN or Same User – get user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id, Authentication auth) {
        User user = userService.getUser(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(DTOMapper.toUserDTO(user));
    }

    // 3) PUBLIC – registration
    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.ok(DTOMapper.toUserDTO(created));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getMe(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(DTOMapper.toUserDTO(user));
    }


    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> updateMe(
            @RequestBody User patch,
            Authentication auth
    ) {
        User me = (User) auth.getPrincipal();
        User updated = userService.updateUser(me.getId(), patch);
        return ResponseEntity.ok(DTOMapper.toUserDTO(updated));
    }


    // 4) UPDATE – user updates themselves OR admin updates anyone
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<UserDTO> update(
            @PathVariable Long id,
            @RequestBody User patch,
            Authentication auth
    ) {
        User user = userService.updateUser(id, patch);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(DTOMapper.toUserDTO(user));
    }

    // Admin can delete anyone (no password)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication
    ) {
        // Must be logged in
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Must send password in body
        if (body == null || !body.containsKey("password")) {
            return ResponseEntity.badRequest().build();  // 400 – missing password
        }

        String rawPassword = body.get("password");

        // Check password
        if (!passwordEncoder.matches(rawPassword, currentUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 – wrong password
        }

        // Everything OK → delete
        userService.deleteUser(currentUser.getId());
        return ResponseEntity.noContent().build(); // 204
    }




    // 6) GET classes for user:
    // Students: only their classes
    // Teachers: only their classes (students enrolled in their classes)
    @GetMapping("/{id}/classes")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<List<ClassForStudentDTO>> getUserClasses(@PathVariable Long id) {

        var classes = userService.getClassesForStudent(id);
        if (classes == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(
                classes.stream()
                        .map(DTOMapper::toClassForStudent)
                        .toList()
        );
    }

    // 7) ADMIN – get unverified teachers
    @GetMapping("/unverified")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> unverifiedTeachers() {
        return userService.getUnverifiedTeachers().stream()
                .map(DTOMapper::toUserDTO)
                .toList();
    }

    // 8) ADMIN – approve teacher
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> approve(@PathVariable Long id) {
        User verified = userService.verifyTeacher(id);
        if (verified == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(DTOMapper.toUserDTO(verified));
    }

    // 9) Teacher submits verification code (self-verification)
    @PostMapping("/{id}/verify")
    public ResponseEntity<UserDTO> verifyTeacherCode(
            @PathVariable Long id,
            @RequestParam String code
    ) {
        User verified = userService.confirmTeacherVerification(id, code);
        if (verified == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(DTOMapper.toUserDTO(verified));
    }

}
