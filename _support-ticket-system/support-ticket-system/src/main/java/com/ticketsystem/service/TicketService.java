package com.ticketsystem.service;

import com.ticketsystem.dto.LocationDTO;
import com.ticketsystem.dto.TicketCategoryDTO;
import com.ticketsystem.dto.TicketDTO;
import com.ticketsystem.dto.TicketResponseDTO;
import com.ticketsystem.dto.UserResponseDTO;
import com.ticketsystem.model.*;
import com.ticketsystem.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketCategoryRepository categoryRepository;

    @Autowired
    private TicketAssignmentRepository assignmentRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private CommentRepository commentRepository;

    // CREATE TICKET
    public TicketResponseDTO createTicket(TicketDTO dto, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        TicketCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Location location = locationRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setPriority(dto.getPriority() != null ? dto.getPriority() : Priority.MEDIUM);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        ticket.setCustomer(customer);
        ticket.setCategory(category);
        ticket.setLocation(location);

        Ticket saved = ticketRepository.save(ticket);

        User assignedAgent = autoAssignAgent(category.getId());
        if (assignedAgent != null) {
            TicketAssignment assignment = new TicketAssignment();
            assignment.setTicket(saved);
            assignment.setAgent(assignedAgent);
            assignment.setAssignedAt(LocalDateTime.now());
            assignment.setStatus(AssignmentStatus.ASSIGNED);
            assignmentRepository.save(assignment);

            notificationService.notifyNewTicketAssigned(assignedAgent, saved);
            notificationService.notifyAdmins("System: Ticket Assigned",
                    "Ticket #" + saved.getId() + " assigned to " + assignedAgent.getName());
        } else {
            notificationService.notifyAdmins("System: New Ticket Created",
                    "Ticket #" + saved.getId() + " created (Unassigned) by " + customer.getName());
        }

        return mapToResponse(saved);
    }

    private User autoAssignAgent(Long categoryId) {
        List<User> agents = userRepository.findAgentsByCategory(categoryId);
        if (agents.isEmpty())
            return null;

        return agents.stream()
                .min(Comparator.comparing(this::countActiveTickets))
                .orElse(null);
    }

    private long countActiveTickets(User agent) {
        return ticketRepository.countAgentTicketsByStatus(agent.getId(), TicketStatus.OPEN,
                AssignmentStatus.ASSIGNED);
    }

    public Optional<TicketResponseDTO> getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(this::mapToResponse);
    }

    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<TicketResponseDTO> getAllTicketsPaginated(
            TicketStatus status,
            com.ticketsystem.model.Priority priority,
            String query,
            Long locationId,
            Boolean unassignedOnly,
            org.springframework.data.domain.Pageable pageable) {
        return ticketRepository.findAllTickets(status, priority, query, locationId, unassignedOnly, pageable)
                .map(this::mapToResponse);
    }

    public TicketResponseDTO updateTicketStatus(Long ticketId, TicketStatus status, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);

        notificationService.notifyTicketStatusChanged(ticket.getCustomer(), ticket);
        notificationService.notifyAdmins("System: Ticket Status Update",
                "Ticket #" + ticket.getId() + " status updated to " + status + " by User ID " + userId);

        return mapToResponse(saved);
    }

    private void logDebug(String msg) {
        try {
            java.nio.file.Files.writeString(
                    java.nio.file.Path.of("debug_log.txt"),
                    java.time.LocalDateTime.now() + " " + msg + "\n",
                    java.nio.file.StandardOpenOption.CREATE,
                    java.nio.file.StandardOpenOption.APPEND);
        } catch (Exception e) {
        }
    }

    public TicketResponseDTO assignTicketToAgent(Long ticketId, Long agentId) {
        logDebug("DEBUG: assignTicketToAgent - Ticket: " + ticketId + ", Agent: " + agentId);
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        logDebug("DEBUG: Agent found: " + agent.getEmail() + " (ID: " + agent.getId() + ")");

        assignmentRepository.deactivateAssignments(ticketId,
                List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACTIVE));

        TicketAssignment assignment = new TicketAssignment();
        assignment.setTicket(ticket);
        assignment.setAgent(agent);
        assignment.setCategory(ticket.getCategory());
        assignment.setStatus(AssignmentStatus.ASSIGNED);
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setNotificationSent(false);
        assignmentRepository.save(assignment);
        logDebug("DEBUG: Assignment saved with status ASSIGNED");

        notificationService.notifyNewTicketAssigned(agent, ticket);
        notificationService.notifyAdmins("System: Ticket Reassigned",
                "Ticket #" + ticket.getId() + " manually assigned to " + agent.getName());

        return mapToResponse(ticket);
    }

    public List<TicketResponseDTO> getTicketsByCustomer(Long customerId) {
        return ticketRepository.findByCustomerId(customerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<TicketResponseDTO> getTicketsByCustomerPaginated(
            Long customerId,
            TicketStatus status,
            com.ticketsystem.model.Priority priority,
            String query,
            org.springframework.data.domain.Pageable pageable) {
        return ticketRepository.findTicketsByCustomer(customerId, status, priority, query, pageable)
                .map(this::mapToResponse);
    }

    public List<TicketResponseDTO> getTicketsByAgent(Long agentId) {
        return assignmentRepository.findByAgentIdAndStatus(agentId, AssignmentStatus.ASSIGNED)
                .stream()
                .map(a -> mapToResponse(a.getTicket()))
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<TicketResponseDTO> getAssignedTicketsPaginated(
            Long agentId, TicketStatus status, String search, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Ticket> page = ticketRepository.findAssignedTickets(agentId, status,
                search, AssignmentStatus.ASSIGNED,
                pageable);
        return page.map(this::mapToResponse);
    }

    public List<TicketResponseDTO> searchTickets(String query) {
        return ticketRepository.searchTickets(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getTicketsByCategory(Long categoryId) {
        return ticketRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Long getTicketCountByStatus(TicketStatus status) {
        return ticketRepository.countByStatus(status);
    }

    private TicketResponseDTO mapToResponse(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();

        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());

        if (ticket.getCustomer() != null) {
            dto.setCustomer(mapUser(ticket.getCustomer()));
        }

        if (ticket.getCategory() != null) {
            dto.setCategory(mapCategory(ticket.getCategory()));
        }

        if (ticket.getLocation() != null) {
            dto.setLocation(mapLocation(ticket.getLocation()));
        }

        assignmentRepository.findActiveAssignment(ticket.getId(), AssignmentStatus.ASSIGNED)
                .stream().findFirst()
                .ifPresent(a -> dto.setAssignedAgent(mapUser(a.getAgent())));

        dto.setComments(
                commentRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId())
                        .stream()
                        .map(this::mapComment)
                        .collect(Collectors.toList()));

        return dto;
    }

    private UserResponseDTO mapUser(User user) {
        if (user == null)
            return null;
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEnabled(user.isEnabled());
        return dto;
    }

    private TicketCategoryDTO mapCategory(TicketCategory category) {
        if (category == null)
            return null;
        TicketCategoryDTO dto = new TicketCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }

    private LocationDTO mapLocation(Location location) {
        if (location == null)
            return null;
        LocationDTO dto = new LocationDTO();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setType(location.getType());
        if (location.getParent() != null) {
            dto.setParentId(location.getParent().getId());
            dto.setParentName(location.getParent().getName());
        }
        return dto;
    }

    private com.ticketsystem.dto.CommentDTO mapComment(Comment comment) {
        if (comment == null)
            return null;
        com.ticketsystem.dto.CommentDTO dto = new com.ticketsystem.dto.CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        if (comment.getTicket() != null) {
            dto.setTicketId(comment.getTicket().getId());
        }
        if (comment.getAuthor() != null) {
            dto.setAuthorName(comment.getAuthor().getName());
            dto.setAuthor(mapUser(comment.getAuthor()));
        }
        return dto;
    }
}
