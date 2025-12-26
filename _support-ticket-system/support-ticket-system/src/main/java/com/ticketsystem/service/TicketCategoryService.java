package com.ticketsystem.service;

import com.ticketsystem.dto.TicketCategoryDTO;
import com.ticketsystem.model.TicketCategory;
import com.ticketsystem.repository.TicketCategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketCategoryService {

    @Autowired
    private TicketCategoryRepository categoryRepository;

    // GET ALL
    public List<TicketCategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public Optional<TicketCategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::mapToDTO);
    }

    // CREATE
    public TicketCategoryDTO createCategory(TicketCategoryDTO dto) {
        TicketCategory category = new TicketCategory();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        categoryRepository.save(category);
        return mapToDTO(category);
    }

    // UPDATE
    public TicketCategoryDTO updateCategory(Long id, TicketCategoryDTO dto) {
        TicketCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        cat.setName(dto.getName());
        cat.setDescription(dto.getDescription());

        categoryRepository.save(cat);
        return mapToDTO(cat);
    }

    // DELETE
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // SEARCH
    public List<TicketCategoryDTO> searchCategories(String query) {
        return categoryRepository.search(query)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET CATEGORIES WITH ACTIVE AGENTS
    public List<TicketCategoryDTO> getCategoriesWithActiveAgents() {
        return categoryRepository.findCategoriesWithAgents()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // MAPPING
    private TicketCategoryDTO mapToDTO(TicketCategory category) {
        TicketCategoryDTO dto = new TicketCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
