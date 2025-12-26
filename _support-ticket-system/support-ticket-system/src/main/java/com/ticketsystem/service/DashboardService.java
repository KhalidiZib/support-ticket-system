package com.ticketsystem.service;

import com.ticketsystem.dto.DashboardResponseDTO;
import com.ticketsystem.dto.CustomerDashboardDTO;
import com.ticketsystem.dto.DashboardStatsDTO;
import com.ticketsystem.model.TicketStatus;
import com.ticketsystem.repository.TicketAssignmentRepository;
import com.ticketsystem.repository.*;
import com.ticketsystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DashboardService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private TicketAssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketCategoryRepository categoryRepository;

    @Autowired
    private LocationRepository locationRepository;

    public DashboardResponseDTO getAdminDashboard() {
        DashboardResponseDTO dto = new DashboardResponseDTO();

        dto.setTotalTickets(ticketRepository.count());
        dto.setOpenTickets(ticketRepository.countByStatus(TicketStatus.OPEN));
        dto.setInProgressTickets(ticketRepository.countByStatus(TicketStatus.IN_PROGRESS));
        dto.setResolvedTickets(ticketRepository.countByStatus(TicketStatus.RESOLVED));
        dto.setClosedTickets(ticketRepository.countByStatus(TicketStatus.CLOSED));

        dto.setAgentsOnline(assignmentRepository.countActiveAgents());
        dto.setTotalUsers(userRepository.count());
        dto.setTotalCategories(categoryRepository.count());
        dto.setTotalLocations(locationRepository.count());

        return dto;
    }

    public DashboardResponseDTO getAgentDashboard(Long agentId) {
        DashboardResponseDTO dto = new DashboardResponseDTO();

        dto.setAssignedTickets(assignmentRepository.countByAgentId(agentId));
        dto.setOpenTickets(ticketRepository.countAgentTicketsByStatus(agentId, TicketStatus.OPEN,
                com.ticketsystem.model.AssignmentStatus.ASSIGNED));
        dto.setInProgressTickets(ticketRepository.countAgentTicketsByStatus(agentId, TicketStatus.IN_PROGRESS,
                com.ticketsystem.model.AssignmentStatus.ASSIGNED));
        dto.setResolvedTickets(ticketRepository.countAgentTicketsByStatus(agentId, TicketStatus.RESOLVED,
                com.ticketsystem.model.AssignmentStatus.ASSIGNED));

        return dto;
    }

    public CustomerDashboardDTO getCustomerDashboard(Long customerId) {
        CustomerDashboardDTO dto = new CustomerDashboardDTO();
        DashboardStatsDTO stats = new DashboardStatsDTO();

        long total = ticketRepository.findByCustomerId(customerId).size();
        stats.setTotalTickets(total);
        stats.setOpenTickets(ticketRepository.countByCustomerIdAndStatus(customerId, TicketStatus.OPEN));
        stats.setInProgressTickets(ticketRepository.countByCustomerIdAndStatus(customerId, TicketStatus.IN_PROGRESS));
        stats.setResolvedTickets(ticketRepository.countByCustomerIdAndStatus(customerId, TicketStatus.RESOLVED));

        dto.setStats(stats);
        java.util.List<com.ticketsystem.model.Ticket> recent = ticketRepository
                .findFirst5ByCustomerIdOrderByCreatedAtDesc(customerId);
        java.util.List<com.ticketsystem.dto.TicketDTO> recentDTOs = recent.stream().map(t -> {
            com.ticketsystem.dto.TicketDTO d = new com.ticketsystem.dto.TicketDTO();
            d.setId(t.getId());
            d.setTitle(t.getTitle());
            d.setDescription(t.getDescription());
            d.setPriority(t.getPriority());
            if (t.getCategory() != null)
                d.setCategoryId(t.getCategory().getId());
            if (t.getLocation() != null)
                d.setLocationId(t.getLocation().getId());
            return d;
        }).collect(java.util.stream.Collectors.toList());

        dto.setRecentTickets(recentDTOs);

        return dto;
    }
}
