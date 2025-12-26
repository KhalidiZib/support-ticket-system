package com.ticketsystem.repository;

import com.ticketsystem.model.TicketCategory;
import com.ticketsystem.model.User;
import com.ticketsystem.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  Boolean existsByEmail(String email);

  List<User> findByRole(UserRole role);

  org.springframework.data.domain.Page<User> findByRole(UserRole role,
      org.springframework.data.domain.Pageable pageable);

  List<User> findByRoleAndEnabledTrue(UserRole role);

  List<User> findByCategoriesInAndRoleAndEnabledTrue(Set<TicketCategory> categories, UserRole role);

  @Query("""
      select distinct u
      from User u
      join u.categories c
      where c.id = :categoryId
        and u.role = com.ticketsystem.model.UserRole.AGENT
        and u.enabled = true
      """)
  List<User> findAgentsByCategory(@Param("categoryId") Long categoryId);

  @Query("""
      select u from User u
      where lower(u.name) like lower(concat('%', :q, '%'))
         or lower(u.email) like lower(concat('%', :q, '%'))
         or cast(u.id as string) like lower(concat('%', :q, '%'))
      """)
  List<User> searchUsers(@Param("q") String query);
}
