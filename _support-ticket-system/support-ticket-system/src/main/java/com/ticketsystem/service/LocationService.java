package com.ticketsystem.service;

import com.ticketsystem.dto.LocationDTO;
import com.ticketsystem.dto.LocationHierarchyDTO;
import com.ticketsystem.model.Location;
import com.ticketsystem.model.LocationType;
import com.ticketsystem.repository.LocationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    // -------------------------------
    // Get All
    // -------------------------------
    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<LocationDTO> getAllLocationsPaginated(
            org.springframework.data.domain.Pageable pageable) {
        return locationRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    // -------------------------------
    // Get by ID
    // -------------------------------
    public Optional<LocationDTO> getLocationById(Long id) {
        return locationRepository.findById(id)
                .map(this::mapToDTO);
    }

    // -------------------------------
    // Create
    // -------------------------------
    public LocationDTO createLocation(LocationDTO dto) {
        Location loc = new Location();
        loc.setName(dto.getName());
        loc.setType(dto.getType());

        if (dto.getParentId() != null) {
            Location parent = locationRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent location not found"));
            loc.setParent(parent);
        }

        Location saved = locationRepository.save(loc);
        return mapToDTO(saved);
    }

    // -------------------------------
    // Update
    // -------------------------------
    public LocationDTO updateLocation(Long id, LocationDTO dto) {
        Location loc = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        loc.setName(dto.getName());
        loc.setType(dto.getType());

        if (dto.getParentId() != null) {
            Location parent = locationRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent not found"));
            loc.setParent(parent);
        } else {
            loc.setParent(null);
        }

        Location saved = locationRepository.save(loc);
        return mapToDTO(saved);
    }

    // -------------------------------
    // Delete
    // -------------------------------
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }

    // -------------------------------
    // Filter by type
    // -------------------------------
    public List<LocationDTO> getLocationsByType(LocationType type) {
        return locationRepository.findByType(type)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Filter by parent
    // -------------------------------
    public List<LocationDTO> getLocationsByParent(Long parentId) {
        return locationRepository.findByParentId(parentId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Top-level (Provinces)
    // -------------------------------
    public List<LocationDTO> getTopLevelLocations() {
        return locationRepository.findByParentIsNull()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Full hierarchy lookup
    // -------------------------------
    public LocationHierarchyDTO getLocationHierarchy(Long id) {
        Location loc = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        LocationHierarchyDTO dto = new LocationHierarchyDTO();
        dto.setLocation(mapToDTO(loc));

        List<LocationDTO> path = new ArrayList<>();
        Location current = loc;

        while (current != null) {
            path.add(mapToDTO(current));
            current = current.getParent();
        }

        Collections.reverse(path);
        dto.setHierarchy(path);

        return dto;
    }

    // -------------------------------
    // Search Villages
    // -------------------------------
    public List<LocationDTO> searchVillages(String name) {
        return locationRepository.searchVillages(name)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Search All Locations
    // -------------------------------
    public List<LocationDTO> searchLocations(String query) {
        return locationRepository.searchLocations(query)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // -------------------------------
    // Full string path
    // -------------------------------
    public String getFullLocationPath(Long id) {
        Location loc = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        List<String> names = new ArrayList<>();

        Location current = loc;
        while (current != null) {
            names.add(current.getName());
            current = current.getParent();
        }

        Collections.reverse(names);
        return String.join(" ➝ ", names);
    }

    // -------------------------------
    // DTO Mapper
    // -------------------------------
    private LocationDTO mapToDTO(Location loc) {
        LocationDTO dto = new LocationDTO();
        dto.setId(loc.getId());
        dto.setName(loc.getName());
        dto.setType(loc.getType());
        dto.setParentId(
                loc.getParent() != null ? loc.getParent().getId() : null);

        // Populate ancestors
        List<LocationDTO> ancestors = new ArrayList<>();
        Location current = loc.getParent();
        while (current != null) {
            LocationDTO ancestorDto = new LocationDTO();
            ancestorDto.setId(current.getId());
            ancestorDto.setName(current.getName());
            ancestorDto.setType(current.getType());
            ancestorDto.setParentId(current.getParent() != null ? current.getParent().getId() : null);
            ancestors.add(ancestorDto);
            current = current.getParent();
        }
        Collections.reverse(ancestors);
        dto.setAncestors(ancestors);

        return dto;
    }
}
