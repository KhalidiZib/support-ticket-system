package com.ticketsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ticketsystem.model.*;
import com.ticketsystem.repository.LocationRepository;
import com.ticketsystem.repository.TicketCategoryRepository;
import com.ticketsystem.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketCategoryRepository categoryRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        System.out.println("=== DataLoader: Checking initial data ===");

        loadAdmin();
        loadAgent();
        loadCustomer();
        loadCategory();
        loadLocations();

        System.out.println("=== DataLoader: Finished ===");
    }

    // -----------------------------
    // USERS
    // -----------------------------

    private void loadAdmin() {
        if (userRepository.existsByEmail("kzibika@gmail.com")) {
            // FORCE UPDATE PASSWORD
            User admin = userRepository.findByEmail("kzibika@gmail.com").get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEnabled(true); // Fix: Ensure admin is enabled
            userRepository.save(admin);
            System.out.println("!!! ADMIN PASSWORD RESET TO admin123 !!!");
            return;
        }

        User admin = new User();
        admin.setName("System Admin");
        admin.setEmail("kzibika@gmail.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(UserRole.ADMIN);
        admin.setEnabled(true);

        userRepository.save(admin);
        System.out.println("!!! ADMIN CREATED WITH PASSWORD admin123 !!!");
    }

    private void loadAgent() {
        if (userRepository.existsByEmail("agent@example.com")) {
            User agent = userRepository.findByEmail("agent@example.com").get();
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setEnabled(true);
            userRepository.save(agent);
            System.out.println("✔ Agent password updated");
            return;
        }

        User agent = new User();
        agent.setName("Default Agent");
        agent.setEmail("agent@example.com");
        agent.setPassword(passwordEncoder.encode("agent123"));
        agent.setRole(UserRole.AGENT);
        agent.setEnabled(true);

        userRepository.save(agent);
        System.out.println("✔ Agent created");
    }

    private void loadCustomer() {
        if (userRepository.existsByEmail("customer@example.com")) {
            User customer = userRepository.findByEmail("customer@example.com").get();
            customer.setPassword(passwordEncoder.encode("customer123"));
            customer.setEnabled(true);
            userRepository.save(customer);
            System.out.println("✔ Customer password updated");
            return;
        }

        User customer = new User();
        customer.setName("Test Customer");
        customer.setEmail("customer@example.com");
        customer.setPassword(passwordEncoder.encode("customer123"));
        customer.setRole(UserRole.CUSTOMER);
        customer.setEnabled(true);

        userRepository.save(customer);
        System.out.println("✔ Customer created");
    }

    // -----------------------------
    // CATEGORY
    // -----------------------------

    private void loadCategory() {
        if (categoryRepository.findByNameIgnoreCase("General Support").isPresent()) {
            return;
        }

        TicketCategory cat = new TicketCategory();
        cat.setName("General Support");
        cat.setDescription("General issues and questions");

        categoryRepository.save(cat);
        System.out.println("✔ Category 'General Support' created");
    }

    // -----------------------------
    // LOCATIONS
    // -----------------------------

    private void loadLocations() {

        // Province
        Location province = locationRepository.findByName("Kigali Province")
                .orElseGet(() -> {
                    Location p = new Location();
                    p.setName("Kigali Province");
                    p.setType(LocationType.PROVINCE);
                    return locationRepository.save(p);
                });

        // District
        Location district = locationRepository.findByName("Gasabo")
                .orElseGet(() -> {
                    Location d = new Location();
                    d.setName("Gasabo");
                    d.setType(LocationType.DISTRICT);
                    d.setParent(province);
                    return locationRepository.save(d);
                });

        // Sector
        Location sector = locationRepository.findByName("Kimironko")
                .orElseGet(() -> {
                    Location s = new Location();
                    s.setName("Kimironko");
                    s.setType(LocationType.SECTOR);
                    s.setParent(district);
                    return locationRepository.save(s);
                });

        // Cell
        Location cell = locationRepository.findByName("Bibare")
                .orElseGet(() -> {
                    Location c = new Location();
                    c.setName("Bibare");
                    c.setType(LocationType.CELL);
                    c.setParent(sector);
                    return locationRepository.save(c);
                });

        // Village
        locationRepository.findByName("Village 1")
                .orElseGet(() -> {
                    Location v = new Location();
                    v.setName("Village 1");
                    v.setType(LocationType.VILLAGE);
                    v.setParent(cell);
                    return locationRepository.save(v);
                });

        System.out.println("✔ Locations hierarchy created or already existed");
    }
}
