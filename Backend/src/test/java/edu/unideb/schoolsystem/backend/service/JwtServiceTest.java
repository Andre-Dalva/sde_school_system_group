package edu.unideb.schoolsystem.backend.service;

import edu.unideb.schoolsystem.backend.model.ROLES;
import edu.unideb.schoolsystem.backend.model.User;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    private User sampleUser() {
        User u = new User();
        u.setUsername("john_doe");
        u.setRole(ROLES.STUDENT);
        return u;
    }

    @Test
    void generateToken_shouldCreateValidToken() {
        User user = sampleUser();
        String token = jwtService.generateToken(user);

        assertThat(token).isNotNull();
        assertThat(token).contains(".");
    }

    @Test
    void extractUsername_shouldReturnCorrectValue() {
        User user = sampleUser();
        String token = jwtService.generateToken(user);

        assertThat(jwtService.extractUsername(token))
                .isEqualTo("john_doe");
    }

    @Test
    void extractRole_shouldReturnCorrectRole() {
        User user = sampleUser();
        String token = jwtService.generateToken(user);

        assertThat(jwtService.extractRole(token))
                .isEqualTo("STUDENT");
    }

    @Test
    void isTokenValid_shouldReturnTrue_forRealToken() {
        User user = sampleUser();
        String token = jwtService.generateToken(user);

        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void isTokenValid_shouldReturnFalse_forMalformedToken() {
        assertThat(jwtService.isTokenValid("fake.token.blah")).isFalse();
    }
}
