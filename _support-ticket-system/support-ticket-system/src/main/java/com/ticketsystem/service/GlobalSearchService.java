package com.ticketsystem.service;

import com.ticketsystem.dto.GlobalSearchRequestDTO;
import com.ticketsystem.dto.GlobalSearchResponseDTO;
import com.ticketsystem.dto.GlobalSearchResultDTO;
import com.ticketsystem.model.Ticket;
import com.ticketsystem.model.User;
import com.ticketsystem.model.TicketCategory;
import com.ticketsystem.repository.TicketRepository;
import com.ticketsystem.repository.UserRepository;
import com.ticketsystem.repository.TicketCategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class GlobalSearchService {

        @Autowired
        private TicketRepository ticketRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TicketCategoryRepository categoryRepository;

        @Autowired
        private com.ticketsystem.repository.LocationRepository locationRepository;

        public GlobalSearchResponseDTO performGlobalSearch(GlobalSearchRequestDTO request) {
                String query = request.getQuery().toLowerCase().trim();

                GlobalSearchResponseDTO response = new GlobalSearchResponseDTO();
                if (response.getResults() == null) {
                        response.setResults(new ArrayList<>());
                }

                // ----------------------------------
                // SEARCH IN TICKETS
                // ----------------------------------
                List<GlobalSearchResultDTO> ticketResults = ticketRepository.searchTickets(query)
                                .stream()
                                .map(t -> new GlobalSearchResultDTO(
                                                "TICKET",
                                                t.getId(),
                                                t.getTitle(),
                                                "Ticket in category: "
                                                                + (t.getCategory() != null ? t.getCategory().getName()
                                                                                : "None")))
                                .collect(Collectors.toList());
                response.getResults().addAll(ticketResults);

                // ----------------------------------
                // SEARCH IN USERS
                // ----------------------------------
                List<GlobalSearchResultDTO> userResults = userRepository.searchUsers(query)
                                .stream()
                                .map(u -> new GlobalSearchResultDTO(
                                                "USER",
                                                u.getId(),
                                                u.getName(),
                                                "Email: " + u.getEmail()))
                                .collect(Collectors.toList());
                response.getResults().addAll(userResults);

                // ----------------------------------
                // SEARCH IN CATEGORIES
                // ----------------------------------
                List<GlobalSearchResultDTO> categoryResults = categoryRepository.search(query)
                                .stream()
                                .map(c -> new GlobalSearchResultDTO(
                                                "CATEGORY",
                                                c.getId(),
                                                c.getName(),
                                                "Ticket Category"))
                                .collect(Collectors.toList());
                response.getResults().addAll(categoryResults);

                // ----------------------------------
                // SEARCH IN LOCATIONS
                // ----------------------------------
                List<GlobalSearchResultDTO> locationResults = locationRepository.searchLocations(query)
                                .stream()
                                .map(l -> new GlobalSearchResultDTO(
                                                "LOCATION",
                                                l.getId(),
                                                l.getName(),
                                                "Location Type: " + l.getType()))
                                .collect(Collectors.toList());
                response.getResults().addAll(locationResults);

                return response;
        }
}
