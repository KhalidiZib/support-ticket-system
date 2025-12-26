package com.ticketsystem.controller;

import com.ticketsystem.dto.DashboardResponseDTO;
import com.ticketsystem.model.User;
import com.ticketsystem.service.AuthService;
import com.ticketsystem.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private AuthService authService;

    @GetMapping("/admin")
    public ResponseEntity<DashboardResponseDTO> getAdminDashboard() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null || !authService.isAdmin(currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/agent")
    public ResponseEntity<DashboardResponseDTO> getAgentDashboard() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null || !authService.isAgent(currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(dashboardService.getAgentDashboard(currentUser.getId()));
    }

    @GetMapping("/customer")
    public ResponseEntity<?> getCustomerDashboard() {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(dashboardService.getCustomerDashboard(currentUser.getId()));
    }
}
