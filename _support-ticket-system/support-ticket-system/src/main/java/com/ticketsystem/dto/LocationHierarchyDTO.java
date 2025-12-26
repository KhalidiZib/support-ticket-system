package com.ticketsystem.dto;

import java.util.List;

public class LocationHierarchyDTO {

    private LocationDTO province;
    private LocationDTO district;
    private LocationDTO sector;
    private LocationDTO cell;
    private LocationDTO village;

    // For some services that expect a "location" + full "hierarchy"
    private LocationDTO location;
    private List<LocationDTO> hierarchy;

    public LocationDTO getProvince() {
        return province;
    }

    public void setProvince(LocationDTO province) {
        this.province = province;
    }

    public LocationDTO getDistrict() {
        return district;
    }

    public void setDistrict(LocationDTO district) {
        this.district = district;
    }

    public LocationDTO getSector() {
        return sector;
    }

    public void setSector(LocationDTO sector) {
        this.sector = sector;
    }

    public LocationDTO getCell() {
        return cell;
    }

    public void setCell(LocationDTO cell) {
        this.cell = cell;
    }

    public LocationDTO getVillage() {
        return village;
    }

    public void setVillage(LocationDTO village) {
        this.village = village;
    }

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public List<LocationDTO> getHierarchy() {
        return hierarchy;
    }

    public void setHierarchy(List<LocationDTO> hierarchy) {
        this.hierarchy = hierarchy;
    }
}
