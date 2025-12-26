package com.ticketsystem.controller;

import com.ticketsystem.dto.TicketCategoryDTO;
import com.ticketsystem.dto.UserDTO;
import com.ticketsystem.dto.UserResponseDTO;
import com.ticketsystem.model.UserRole;
import com.ticketsystem.service.TicketCategoryService;
import com.ticketsystem.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private TicketCategoryService categoryService;

    // -------------------------
    // USER MANAGEMENT
    // -------------------------

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> listUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponseDTO> createUser(
            @Valid @RequestBody UserDTO dto
    ) {
        UserResponseDTO created = userService.createUser(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO dto
    ) {
        UserResponseDTO updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/agents")
    public ResponseEntity<List<UserResponseDTO>> listAgents() {
        return ResponseEntity.ok(userService.getUsersByRole(UserRole.AGENT));
    }

    @GetMapping("/customers")
    public ResponseEntity<List<UserResponseDTO>> listCustomers() {
        return ResponseEntity.ok(userService.getUsersByRole(UserRole.CUSTOMER));
    }

    // -------------------------
    // CATEGORY MANAGEMENT
    // -------------------------

    @GetMapping("/categories")
    public ResponseEntity<List<TicketCategoryDTO>> listCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<TicketCategoryDTO> createCategory(
            @Valid @RequestBody TicketCategoryDTO dto
    ) {
        TicketCategoryDTO created = categoryService.createCategory(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<TicketCategoryDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody TicketCategoryDTO dto
    ) {
        TicketCategoryDTO updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
