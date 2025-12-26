package com.ticketsystem.dto;

import java.util.Map;

public class DashboardResponseDTO {

    private Long totalTickets;
    private Long openTickets;
    private Long inProgressTickets;
    private Long resolvedTickets;
    private Long closedTickets;

    // For admin dashboard
    private Long agentsOnline;

    // For agent dashboard
    private Long assignedTickets;

    // Additional Stats
    private Long totalUsers;
    private Long totalCategories;
    private Long totalLocations;

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Long getTotalLocations() {
        return totalLocations;
    }

    public void setTotalLocations(Long totalLocations) {
        this.totalLocations = totalLocations;
    }

    private Map<String, Long> ticketsByCategory;
    private Map<String, Long> ticketsByPriority;
    private Map<String, Long> ticketsByStatus;
    private Map<String, Long> agentWorkload;

    // in hours
    private Double averageResolutionTime;

    // percentage
    private Integer slaComplianceRate;

    public DashboardResponseDTO() {
    }

    public Long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(Long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public Long getOpenTickets() {
        return openTickets;
    }

    public void setOpenTickets(Long openTickets) {
        this.openTickets = openTickets;
    }

    public Long getInProgressTickets() {
        return inProgressTickets;
    }

    public void setInProgressTickets(Long inProgressTickets) {
        this.inProgressTickets = inProgressTickets;
    }

    public Long getResolvedTickets() {
        return resolvedTickets;
    }

    public void setResolvedTickets(Long resolvedTickets) {
        this.resolvedTickets = resolvedTickets;
    }

    public Long getClosedTickets() {
        return closedTickets;
    }

    public void setClosedTickets(Long closedTickets) {
        this.closedTickets = closedTickets;
    }

    public Long getAgentsOnline() {
        return agentsOnline;
    }

    public void setAgentsOnline(Long agentsOnline) {
        this.agentsOnline = agentsOnline;
    }

    public Long getAssignedTickets() {
        return assignedTickets;
    }

    public void setAssignedTickets(Long assignedTickets) {
        this.assignedTickets = assignedTickets;
    }

    public Map<String, Long> getTicketsByCategory() {
        return ticketsByCategory;
    }

    public void setTicketsByCategory(Map<String, Long> ticketsByCategory) {
        this.ticketsByCategory = ticketsByCategory;
    }

    public Map<String, Long> getTicketsByPriority() {
        return ticketsByPriority;
    }

    public void setTicketsByPriority(Map<String, Long> ticketsByPriority) {
        this.ticketsByPriority = ticketsByPriority;
    }

    public Map<String, Long> getTicketsByStatus() {
        return ticketsByStatus;
    }

    public void setTicketsByStatus(Map<String, Long> ticketsByStatus) {
        this.ticketsByStatus = ticketsByStatus;
    }

    public Map<String, Long> getAgentWorkload() {
        return agentWorkload;
    }

    public void setAgentWorkload(Map<String, Long> agentWorkload) {
        this.agentWorkload = agentWorkload;
    }

    public Double getAverageResolutionTime() {
        return averageResolutionTime;
    }

    public void setAverageResolutionTime(Double averageResolutionTime) {
        this.averageResolutionTime = averageResolutionTime;
    }

    public Integer getSlaComplianceRate() {
        return slaComplianceRate;
    }

    public void setSlaComplianceRate(Integer slaComplianceRate) {
        this.slaComplianceRate = slaComplianceRate;
    }
}
