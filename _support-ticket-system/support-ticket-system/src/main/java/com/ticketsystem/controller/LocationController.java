package com.ticketsystem.controller;

import com.ticketsystem.dto.LocationDTO;
import com.ticketsystem.dto.LocationHierarchyDTO;
import com.ticketsystem.model.LocationType;
import com.ticketsystem.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getAll() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }

    @GetMapping("/paginated")
    public ResponseEntity<org.springframework.data.domain.Page<LocationDTO>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity.ok(locationService.getAllLocationsPaginated(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationDTO> getById(@PathVariable Long id) {
        return locationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LocationDTO> create(
            @Valid @RequestBody LocationDTO dto) {
        LocationDTO created = locationService.createLocation(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LocationDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody LocationDTO dto) {
        LocationDTO updated = locationService.updateLocation(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<LocationDTO>> getByType(
            @PathVariable LocationType type) {
        return ResponseEntity.ok(locationService.getLocationsByType(type));
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<LocationDTO>> getByParent(
            @PathVariable Long parentId) {
        return ResponseEntity.ok(locationService.getLocationsByParent(parentId));
    }

    @GetMapping("/top-level")
    public ResponseEntity<List<LocationDTO>> getTopLevel() {
        return ResponseEntity.ok(locationService.getTopLevelLocations());
    }

    @GetMapping("/{id}/hierarchy")
    public ResponseEntity<LocationHierarchyDTO> getHierarchy(
            @PathVariable Long id) {
        LocationHierarchyDTO dto = locationService.getLocationHierarchy(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/villages/search")
    public ResponseEntity<List<LocationDTO>> searchVillages(
            @RequestParam String name) {
        return ResponseEntity.ok(locationService.searchVillages(name));
    }

    @GetMapping("/search")
    public ResponseEntity<List<LocationDTO>> searchLocations(
            @RequestParam String query) {
        return ResponseEntity.ok(locationService.searchLocations(query));
    }

    @GetMapping("/{id}/full-path")
    public ResponseEntity<String> getFullPath(@PathVariable Long id) {
        String path = locationService.getFullLocationPath(id);
        return ResponseEntity.ok(path);
    }
}
