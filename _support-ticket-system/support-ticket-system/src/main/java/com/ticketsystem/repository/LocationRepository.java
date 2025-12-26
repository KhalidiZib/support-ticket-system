package com.ticketsystem.repository;

import com.ticketsystem.model.Location;
import com.ticketsystem.model.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByType(LocationType type);

    List<Location> findByParent(Location parent);

    List<Location> findByParentId(Long parentId);

    List<Location> findByTypeAndParentIsNull(LocationType type);

    List<Location> findByNameContainingIgnoreCaseAndType(LocationType type, String name);

    Optional<Location> findByNameIgnoreCaseAndType(String name, LocationType type);

    Optional<Location> findByName(String name);

    // ROOT nodes (provinces)
    List<Location> findByParentIsNull();

    // 🔍 Search only in VILLAGES
    @Query("SELECT l FROM Location l WHERE l.type = 'VILLAGE' AND LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Location> searchVillages(String query);

    // 🔍 Generic Search (All Types)
    @Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Location> searchLocations(String query);
}
