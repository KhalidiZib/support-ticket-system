package com.ticketsystem.repository;

import com.ticketsystem.model.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {

    Optional<TicketCategory> findByNameIgnoreCase(String name);

    List<TicketCategory> findByNameContainingIgnoreCase(String name);

    @Query("""
           select c from TicketCategory c
           where lower(c.name) like lower(concat('%', :q, '%'))
              or lower(c.description) like lower(concat('%', :q, '%'))
           """)
    List<TicketCategory> search(@Param("q") String query);

    @Query("""
       select distinct c
       from TicketCategory c
       join c.agents a
       where a.enabled = true
       """)
    List<TicketCategory> findCategoriesWithAgents();

}
