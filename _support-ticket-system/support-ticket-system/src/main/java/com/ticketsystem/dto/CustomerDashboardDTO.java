package com.ticketsystem.dto;

import com.ticketsystem.model.Ticket;
import java.util.List;

public class CustomerDashboardDTO {
    private DashboardStatsDTO stats;
    private List<TicketDTO> recentTickets;

    public DashboardStatsDTO getStats() {
        return stats;
    }

    public void setStats(DashboardStatsDTO stats) {
        this.stats = stats;
    }

    public List<TicketDTO> getRecentTickets() {
        return recentTickets;
    }

    public void setRecentTickets(List<TicketDTO> recentTickets) {
        this.recentTickets = recentTickets;
    }
}
