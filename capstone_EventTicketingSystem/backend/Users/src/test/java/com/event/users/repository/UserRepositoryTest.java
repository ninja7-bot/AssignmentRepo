package com.event.users.repository;

import com.event.users.entity.User;
import com.event.users.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User createTestUser(String name, String email, String phone, UserRole role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword("someHashedPassword");
        user.setPhone(phone);
        user.setRole(role);
        return user;
    }

    @Test
    void testSaveUser() {
        User user = createTestUser("John Doe", "john@gmail.com", "1234567890", UserRole.CUSTOMER);

        User savedUser = userRepository.save(user);

        assertNotNull(savedUser.getId());
        assertEquals("John Doe", savedUser.getName());
        assertEquals("john@gmail.com", savedUser.getEmail());
    }

    @Test
    void testFindByEmail() {
        User user = createTestUser("Jane Doe", "jane@gmail.com", "9876543210", UserRole.CUSTOMER);
        userRepository.save(user);

        Optional<User> result = userRepository.findByEmail("jane@gmail.com");

        assertTrue(result.isPresent());
        assertEquals("Jane Doe", result.get().getName());
    }

    @Test
    void testNonExistentFindByEmail() {
        Optional<User> result = userRepository.findByEmail("dummy@gmail.com");

        assertFalse(result.isPresent());
    }

    @Test
    void testExistsByEmail() {
        User user = createTestUser("Test User", "test@gmail.com", "1234567890", UserRole.CUSTOMER);
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("test@gmail.com");

        assertTrue(exists);
    }

    @Test
    void testNonExistentByEmail() {
        boolean exists = userRepository.existsByEmail("bleh@gmail.com");

        assertFalse(exists);
    }
}