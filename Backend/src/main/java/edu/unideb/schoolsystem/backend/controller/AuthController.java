package edu.unideb.schoolsystem.backend.controller;

import edu.unideb.schoolsystem.backend.dto.LoginRequestDTO;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.repository.UserRepository;
import edu.unideb.schoolsystem.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {

        var user = userRepository.findByEmailOrUsername(
                request.getIdentifier(),
                request.getIdentifier()
        ).orElse(null);

        if (user == null)
            return ResponseEntity.status(401).body("Invalid username/email");

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            return ResponseEntity.status(401).body("Invalid password");

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(token);
    }
}
