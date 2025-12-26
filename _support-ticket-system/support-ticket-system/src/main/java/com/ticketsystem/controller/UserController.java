package com.ticketsystem.controller;

import com.ticketsystem.dto.UserDTO;
import com.ticketsystem.dto.UserResponseDTO;
import com.ticketsystem.model.User;
import com.ticketsystem.model.UserRole;
import com.ticketsystem.service.AuthService;
import com.ticketsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    // ADMIN: list all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRolePaginated(role, pageable));
        }
        return ResponseEntity.ok(userService.getAllUsersPaginated(pageable));
    }

    // ADMIN or AGENT: get user by id
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    // ADMIN: create any user (agent, admin, customer)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> createUser(
            @Valid @RequestBody UserDTO dto) {

        // DEBUG: Log the received role to diagnose "Always Customer" issue
        System.out.println("DEBUG: UserController.createUser called. Received Role: " + dto.getRole());

        // RESTRICTION: Only main admin can create ADMIN users
        if (dto.getRole() == UserRole.ADMIN) {
            User currentUser = authService.getCurrentUser();
            if (currentUser == null || !"kzibika@gmail.com".equalsIgnoreCase(currentUser.getEmail())) {
                System.out.println("DEBUG: Blocked ADMIN creation attempt by: "
                        + (currentUser != null ? currentUser.getEmail() : "null"));
                return ResponseEntity.status(403).build(); // Forbidden
            }
        }

        UserResponseDTO created = userService.createUser(dto);
        return ResponseEntity.ok(created);
    }

    // ADMIN: update user
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO dto) {
        UserResponseDTO updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(updated);
    }

    // ADMIN: delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // ADMIN: toggle user status (disable/enable)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDTO> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }

    // ADMIN: list agents
    @GetMapping("/agents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAgents() {
        List<UserResponseDTO> agents = userService.getUsersByRole(UserRole.AGENT);
        return ResponseEntity.ok(agents);
    }

    // ADMIN: list customers
    @GetMapping("/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getCustomers() {
        List<UserResponseDTO> customers = userService.getUsersByRole(UserRole.CUSTOMER);
        return ResponseEntity.ok(customers);
    }

    // ADMIN: assign categories to agent
    @PostMapping("/{agentId}/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> assignCategoriesToAgent(
            @PathVariable Long agentId,
            @RequestBody List<Long> categoryIds) {
        userService.assignCategories(agentId, categoryIds);
        return ResponseEntity.ok().build();
    }

    // ADMIN: Search users
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> searchUsers(
            @RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }

    // PROFILE: current logged-in user
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMyProfile() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        UserResponseDTO dto = userService.getById(currentUser.getId());
        return ResponseEntity.ok(dto);
    }

    // PROFILE: update info
    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateMyProfile(@RequestBody UserDTO dto) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), dto));
    }

    // PROFILE: upload avatar
    @PostMapping("/me/avatar")
    public ResponseEntity<UserResponseDTO> uploadAvatar(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        if (file.isEmpty())
            return ResponseEntity.badRequest().build();

        try {
            // Save file logic (Simplified for demo: saving to project root/uploads)
            String uploadDir = "uploads/";
            java.io.File directory = new java.io.File(uploadDir);
            if (!directory.exists())
                directory.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + filename);
            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // In real prod, this would be a cloud URL. For local dev, we serve raw bytes or
            // map resource.
            // For now, let's just save the filename/path as the URL, frontend will need to
            // handle serving or we assume separate media server.
            // Using a relative path that we'll Expose via WebConfig or just assume frontend
            // can't really "serve" it easily without a controller for static content.
            // Let's add a quick "serve" endpoint or typical Spring "static" mapping.
            // Actually, simpler: return the API path to fetch it?
            // "/api/users/avatars/{filename}"

            String avatarUrl = "/api/users/avatars/" + filename;
            return ResponseEntity.ok(userService.uploadAvatar(currentUser.getId(), avatarUrl));

        } catch (java.io.IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Serve avatar
    @GetMapping("/avatars/{filename}")
    public ResponseEntity<org.springframework.core.io.Resource> getAvatar(@PathVariable String filename) {
        try {
            java.nio.file.Path path = java.nio.file.Paths.get("uploads/" + filename);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (java.net.MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
