package com.ticketsystem.repository;

import com.ticketsystem.model.AssignmentStatus;
import com.ticketsystem.model.Ticket;
import com.ticketsystem.model.TicketAssignment;
import com.ticketsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketAssignmentRepository extends JpaRepository<TicketAssignment, Long> {

    List<TicketAssignment> findByAgent(User agent);

    List<TicketAssignment> findByTicket(Ticket ticket);

    Optional<TicketAssignment> findFirstByTicketOrderByAssignedAtDesc(Ticket ticket);

    Long countByAgentAndStatus(User agent, AssignmentStatus status);

    @Query("select count(ta) from TicketAssignment ta where ta.agent.id = :agentId")
    Long countByAgentId(@Param("agentId") Long agentId);

    // How many agents currently have at least one ACTIVE assignment
    @Query("select count(distinct ta.agent.id) from TicketAssignment ta where ta.status = com.ticketsystem.model.AssignmentStatus.ASSIGNED")
    Long countActiveAgents();

    @Modifying
    @Query("delete from TicketAssignment ta where ta.ticket.id = :ticketId and ta.status IN :statuses")
    void deactivateAssignments(@Param("ticketId") Long ticketId, @Param("statuses") List<AssignmentStatus> statuses);

    List<TicketAssignment> findByAgentIdAndStatus(Long agentId, AssignmentStatus status);

    @Query("select ta from TicketAssignment ta where ta.ticket.id = :ticketId and ta.status = :status")
    List<TicketAssignment> findActiveAssignment(@Param("ticketId") Long ticketId,
            @Param("status") AssignmentStatus status);

    @Modifying
    @Query("delete from TicketAssignment ta where ta.agent.id = :agentId")
    void deleteByAgentId(@Param("agentId") Long agentId);

    @Modifying
    @Query("delete from TicketAssignment ta where ta.ticket.customer.id = :customerId")
    void deleteByTicketCustomerId(@Param("customerId") Long customerId);
}
