package com.ticketsystem.controller;

import com.ticketsystem.dto.TicketCategoryDTO;
import com.ticketsystem.service.TicketCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class TicketCategoryController {

    @Autowired
    private TicketCategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<TicketCategoryDTO>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketCategoryDTO> getById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketCategoryDTO> create(
            @Valid @RequestBody TicketCategoryDTO dto
    ) {
        TicketCategoryDTO created = categoryService.createCategory(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketCategoryDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TicketCategoryDTO dto
    ) {
        TicketCategoryDTO updated = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TicketCategoryDTO>> search(
            @RequestParam String query
    ) {
        return ResponseEntity.ok(categoryService.searchCategories(query));
    }

    @GetMapping("/with-agents")
    public ResponseEntity<List<TicketCategoryDTO>> getCategoriesWithAgents() {
        return ResponseEntity.ok(categoryService.getCategoriesWithActiveAgents());
    }
}
