package com.ticketsystem.controller;

import com.ticketsystem.dto.GlobalSearchRequestDTO;
import com.ticketsystem.dto.GlobalSearchResponseDTO;
import com.ticketsystem.model.User;
import com.ticketsystem.service.AuthService;
import com.ticketsystem.service.GlobalSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class GlobalSearchController {

    @Autowired
    private GlobalSearchService globalSearchService;

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<GlobalSearchResponseDTO> search(
            @RequestBody GlobalSearchRequestDTO request
    ) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        // You can add role-specific restrictions to what results are visible here.
        GlobalSearchResponseDTO response = globalSearchService.performGlobalSearch(request);
        return ResponseEntity.ok(response);
    }
}
