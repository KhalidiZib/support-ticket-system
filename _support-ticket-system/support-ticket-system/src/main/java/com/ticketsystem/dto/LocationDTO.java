package com.ticketsystem.dto;

import com.ticketsystem.model.LocationType;

import java.util.List;

public class LocationDTO {
    private Long id;
    private String name;
    private LocationType type;
    private Long parentId;
    private String parentName;
    private LocationDTO parent;
    private List<LocationDTO> ancestors;

    // Constructors
    public LocationDTO() {
    }

    public LocationDTO(Long id, String name, LocationType type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocationType getType() {
        return type;
    }

    public void setType(LocationType type) {
        this.type = type;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public LocationDTO getParent() {
        return parent;
    }

    public void setParent(LocationDTO parent) {
        this.parent = parent;
    }

    public List<LocationDTO> getAncestors() {
        return ancestors;
    }

    public void setAncestors(List<LocationDTO> ancestors) {
        this.ancestors = ancestors;
    }
}