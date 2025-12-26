package com.ticketsystem.controller;

import com.ticketsystem.dto.TicketDTO;
import com.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.model.TicketStatus;
import com.ticketsystem.model.User;
import com.ticketsystem.service.AuthService;
import com.ticketsystem.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private AuthService authService;

    // --------------------------------------------------------------------
    // ADMIN: Get all tickets
    // --------------------------------------------------------------------
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<TicketResponseDTO>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) com.ticketsystem.model.Priority priority,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) Boolean unassignedOnly) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity
                .ok(ticketService.getAllTicketsPaginated(status, priority, search, locationId, unassignedOnly,
                        pageable));
    }

    // --------------------------------------------------------------------
    // SECURED: Get ticket by ID with permission checking
    // --------------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {

        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        Optional<TicketResponseDTO> optional = ticketService.getTicketById(id);
        if (optional.isEmpty())
            return ResponseEntity.notFound().build();

        TicketResponseDTO ticket = optional.get();

        boolean allowed = authService.isAdmin(currentUser)
                || (authService.isAgent(currentUser)
                        && ticket.getAssignedAgent() != null
                        && ticket.getAssignedAgent().getId().equals(currentUser.getId()))
                || (authService.isCustomer(currentUser)
                        && ticket.getCustomer() != null
                        && ticket.getCustomer().getId().equals(currentUser.getId()));

        if (!allowed)
            return ResponseEntity.status(403).build();

        return ResponseEntity.ok(ticket);
    }

    // --------------------------------------------------------------------
    // CUSTOMER: Create new ticket
    // --------------------------------------------------------------------
    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<TicketResponseDTO> createTicket(
            @Valid @RequestBody TicketDTO ticketDTO) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        try {
            TicketResponseDTO created = ticketService.createTicket(ticketDTO, currentUser.getId());
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // --------------------------------------------------------------------
    // SECURED: Update ticket status (Agent or Admin)
    // --------------------------------------------------------------------
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<TicketResponseDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status) {
        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        try {
            TicketResponseDTO updated = ticketService.updateTicketStatus(id, status, currentUser.getId());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // --------------------------------------------------------------------
    // ADMIN: Reassign ticket manually
    // --------------------------------------------------------------------
    @PutMapping("/{id}/assign/{agentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponseDTO> assignTicketToAgent(
            @PathVariable Long id,
            @PathVariable Long agentId) {
        try {
            System.out.println("Assigning ticket " + id + " to agent " + agentId);
            TicketResponseDTO updated = ticketService.assignTicketToAgent(id, agentId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Assignment Failed: " + e.getMessage());
            e.printStackTrace();
            try {
                java.nio.file.Files.writeString(
                        java.nio.file.Path.of("debug_log.txt"),
                        java.time.LocalDateTime.now() + " ERROR: Assignment Failed: " + e.getMessage() + "\n"
                                + java.util.Arrays.toString(e.getStackTrace()) + "\n",
                        java.nio.file.StandardOpenOption.CREATE,
                        java.nio.file.StandardOpenOption.APPEND);
            } catch (Exception ex) {
            }
            return ResponseEntity.badRequest().build();
        }
    }

    // --------------------------------------------------------------------
    // CUSTOMER: View only their own tickets
    // --------------------------------------------------------------------
    @GetMapping("/my-tickets")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<org.springframework.data.domain.Page<TicketResponseDTO>> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) com.ticketsystem.model.Priority priority,
            @RequestParam(required = false) String search) {

        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        return ResponseEntity.ok(
                ticketService.getTicketsByCustomerPaginated(currentUser.getId(), status, priority, search, pageable));
    }

    // --------------------------------------------------------------------
    // AGENT: View only assigned tickets
    // --------------------------------------------------------------------
    // --------------------------------------------------------------------
    // AGENT: View only assigned tickets
    // --------------------------------------------------------------------
    @GetMapping("/assigned-tickets")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<org.springframework.data.domain.Page<TicketResponseDTO>> getAssignedTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) String search) {

        User currentUser = authService.getCurrentUser();
        if (currentUser == null)
            return ResponseEntity.status(401).build();

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        return ResponseEntity.ok(
                ticketService.getAssignedTicketsPaginated(currentUser.getId(), status, search, pageable));
    }

    // --------------------------------------------------------------------
    // ADMIN or AGENT: Filter by status
    // --------------------------------------------------------------------
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByStatus(
            @PathVariable TicketStatus status) {
        return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }

    // --------------------------------------------------------------------
    // ADMIN or AGENT: Filter by category
    // --------------------------------------------------------------------
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(ticketService.getTicketsByCategory(categoryId));
    }

    // --------------------------------------------------------------------
    // ADMIN or AGENT: Search tickets
    // --------------------------------------------------------------------
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<List<TicketResponseDTO>> searchTickets(
            @RequestParam String query) {
        return ResponseEntity.ok(ticketService.searchTickets(query));
    }

    // --------------------------------------------------------------------
    // ADMIN or AGENT: Count by status
    // --------------------------------------------------------------------
    @GetMapping("/stats/count")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<Long> getTicketCountByStatus(
            @RequestParam TicketStatus status) {
        return ResponseEntity.ok(ticketService.getTicketCountByStatus(status));
    }
}
