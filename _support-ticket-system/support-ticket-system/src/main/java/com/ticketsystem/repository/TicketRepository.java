package com.ticketsystem.repository;

import com.ticketsystem.model.Ticket;
import com.ticketsystem.model.TicketCategory;
import com.ticketsystem.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

        List<Ticket> findByCustomerId(Long customerId);

        List<Ticket> findByAssignedAgentId(Long agentId);

        List<Ticket> findByStatus(TicketStatus status);

        List<Ticket> findByCategory(TicketCategory category);

        List<Ticket> findByCategoryId(Long categoryId);

        Long countByStatus(TicketStatus status);

        Long countByAssignedAgentId(Long agentId);

        Long countByCategory(TicketCategory category);

        List<Ticket> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        String title, String description);

        Optional<Ticket> findFirstByCategoryAndStatusOrderByCreatedAtAsc(
                        TicketCategory category, TicketStatus status);

        @Query("""
                        select t from Ticket t
                        where lower(t.title) like lower(concat('%', :q, '%'))
                           or lower(t.description) like lower(concat('%', :q, '%'))
                           or cast(t.id as string) like lower(concat('%', :q, '%'))
                        """)
        List<Ticket> searchTickets(@Param("q") String query);

        @Query("""
                        select count(t)
                        from TicketAssignment ta
                        join ta.ticket t
                        where ta.agent.id = :agentId
                          and t.status = :status
                          and ta.status = :assignmentStatus
                        """)
        Long countAgentTicketsByStatus(@Param("agentId") Long agentId,
                        @Param("status") TicketStatus status,
                        @Param("assignmentStatus") com.ticketsystem.model.AssignmentStatus assignmentStatus);

        @Query("""
                        SELECT t FROM Ticket t
                        JOIN TicketAssignment ta ON t.id = ta.ticket.id
                        WHERE ta.agent.id = :agentId
                          AND ta.status = :assignmentStatus
                          AND (:status IS NULL OR t.status = :status)
                          AND (:query IS NULL OR (LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(t.id AS string) LIKE LOWER(CONCAT('%', :query, '%'))))
                        """)
        org.springframework.data.domain.Page<Ticket> findAssignedTickets(@Param("agentId") Long agentId,
                        @Param("status") TicketStatus status,
                        @Param("query") String query,
                        @Param("assignmentStatus") com.ticketsystem.model.AssignmentStatus assignmentStatus,
                        org.springframework.data.domain.Pageable pageable);

        Long countByCustomerIdAndStatus(Long customerId, TicketStatus status);

        List<Ticket> findFirst5ByCustomerIdOrderByCreatedAtDesc(Long customerId);

        @Query("""
                        SELECT t FROM Ticket t
                        WHERE (:status IS NULL OR t.status = :status)
                           AND (:priority IS NULL OR t.priority = :priority)
                           AND (:query IS NULL OR (LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(t.id AS string) LIKE LOWER(CONCAT('%', :query, '%'))))
                           AND (:locationId IS NULL OR t.location.id = :locationId)
                           AND (:unassignedOnly IS NULL OR :unassignedOnly = false OR NOT EXISTS (SELECT 1 FROM TicketAssignment ta WHERE ta.ticket = t AND ta.status = 'ASSIGNED'))
                        """)
        org.springframework.data.domain.Page<Ticket> findAllTickets(
                        @Param("status") TicketStatus status,
                        @Param("priority") com.ticketsystem.model.Priority priority,
                        @Param("query") String query,
                        @Param("locationId") Long locationId,
                        @Param("unassignedOnly") Boolean unassignedOnly,
                        org.springframework.data.domain.Pageable pageable);

        @Query("""
                        SELECT t FROM Ticket t
                        WHERE t.customer.id = :customerId
                          AND (:status IS NULL OR t.status = :status)
                          AND (:priority IS NULL OR t.priority = :priority)
                          AND (:query IS NULL OR (LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(t.id AS string) LIKE LOWER(CONCAT('%', :query, '%'))))
                        """)
        org.springframework.data.domain.Page<Ticket> findTicketsByCustomer(
                        @Param("customerId") Long customerId,
                        @Param("status") TicketStatus status,
                        @Param("priority") com.ticketsystem.model.Priority priority,
                        @Param("query") String query,
                        org.springframework.data.domain.Pageable pageable);

        void deleteByCustomerId(Long customerId);

        @Modifying
        @Query("update Ticket t set t.assignedAgent = null where t.assignedAgent.id = :agentId")
        void unassignTickets(@Param("agentId") Long agentId);
}
