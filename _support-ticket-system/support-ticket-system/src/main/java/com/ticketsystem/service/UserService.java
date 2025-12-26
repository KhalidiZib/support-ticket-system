package com.ticketsystem.service;

import com.ticketsystem.dto.UserDTO;
import com.ticketsystem.dto.UserResponseDTO;
import com.ticketsystem.model.TicketCategory;
import com.ticketsystem.model.User;
import com.ticketsystem.model.UserRole;
import com.ticketsystem.repository.TicketCategoryRepository;
import com.ticketsystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    private com.ticketsystem.repository.TicketAssignmentRepository assignmentRepository;

    @Autowired
    private com.ticketsystem.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.ticketsystem.repository.CommentRepository commentRepository;

    @Autowired
    private com.ticketsystem.service.NotificationService notificationService;

    @Autowired
    private com.ticketsystem.repository.TicketRepository ticketRepository;

    @Autowired
    private com.ticketsystem.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponseDTO getById(Long id) {
        if (id == null)
            throw new IllegalArgumentException("ID cannot be null");
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public UserResponseDTO createUser(UserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole(dto.getRole() != null ? dto.getRole() : UserRole.CUSTOMER);
        user.setEnabled(true);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            // Default password for created users if needed
            user.setPassword(passwordEncoder.encode("Password123!"));
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public UserResponseDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public void deleteUser(Long id) {
        try {
            // Cleanup constrained data before deleting user

            // --- IF USER IS AGENT ---
            // 1. Unassign from tickets (fix usage as "assignedAgent")
            ticketRepository.unassignTickets(id);

            // 2. Remove assignments (TicketAssignment entity where user is agent)
            assignmentRepository.deleteByAgentId(id);

            // --- IF USER IS CUSTOMER (or creator of tickets) ---
            // 3. Delete DEPENDENCIES of created tickets first!
            // (Assignments pointing to tickets owned by this user)
            assignmentRepository.deleteByTicketCustomerId(id);
            // (Comments on tickets owned by this user)
            commentRepository.deleteByTicketCustomerId(id);

            // --- COMMON ---
            // 4. Remove comments made BY this user (on any ticket)
            commentRepository.deleteByAuthorId(id);

            // 5. Remove notifications sent TO this user
            notificationRepository.deleteByRecipientId(id);

            // 6. Remove password reset tokens
            User user = userRepository.findById(id).orElse(null);
            if (user != null) {
                // Ensure categories are cleared to remove join table entries
                user.getCategories().clear();
                userRepository.save(user);

                passwordResetTokenRepository.deleteByUser(user);
            }

            // 7. Delete tickets created BY this user (if customer)
            ticketRepository.deleteByCustomerId(id);

            // 8. Finally delete the user
            userRepository.deleteById(id);
            notificationService.notifyAdmins("System: User Deleted",
                    "User ID " + id + " has been deleted from the system.");

        } catch (Exception e) {
            System.err.println("Error deleting user " + id + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    public UserResponseDTO toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public List<UserResponseDTO> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<UserResponseDTO> getUsersByRolePaginated(
            UserRole role, org.springframework.data.domain.Pageable pageable) {
        return userRepository.findByRole(role, pageable)
                .map(this::mapToResponse);
    }

    public org.springframework.data.domain.Page<UserResponseDTO> getAllUsersPaginated(
            org.springframework.data.domain.Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public UserResponseDTO updateProfile(Long userId, UserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getName() != null)
            user.setName(dto.getName());
        if (dto.getPhoneNumber() != null)
            user.setPhoneNumber(dto.getPhoneNumber());
        // Email/Role not updatable via simple profile update

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public UserResponseDTO uploadAvatar(Long userId, String avatarUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatarUrl(avatarUrl);
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public List<UserResponseDTO> searchUsers(String query) {
        return userRepository.searchUsers(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void assignCategories(Long agentId, List<Long> categoryIds) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != UserRole.AGENT) {
            throw new RuntimeException("User is not an agent");
        }

        Set<TicketCategory> categories = new HashSet<>(ticketCategoryRepository.findAllById(categoryIds));

        agent.setCategories(categories);
        userRepository.save(agent);
    }

    // -----------------------
    // Mapping helpers
    // -----------------------

    private UserResponseDTO mapToResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setEnabled(user.isEnabled());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}
