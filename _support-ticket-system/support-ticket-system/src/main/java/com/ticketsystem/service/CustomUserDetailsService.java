package com.ticketsystem.service;

import com.ticketsystem.model.User;
import com.ticketsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                try {
                        java.nio.file.Files.writeString(java.nio.file.Path.of("debug.txt"),
                                        "Loading user: " + email + "\n", java.nio.file.StandardOpenOption.CREATE,
                                        java.nio.file.StandardOpenOption.APPEND);
                } catch (Exception e) {
                }

                User user = userRepository.findByEmail(email)
                                .orElseThrow(
                                                () -> {
                                                        try {
                                                                java.nio.file.Files.writeString(
                                                                                java.nio.file.Path.of("debug.txt"),
                                                                                "User NOT found: " + email + "\n",
                                                                                java.nio.file.StandardOpenOption.CREATE,
                                                                                java.nio.file.StandardOpenOption.APPEND);
                                                        } catch (Exception e) {
                                                        }
                                                        return new UsernameNotFoundException(
                                                                        "User not found: " + email);
                                                });

                try {
                        java.nio.file.Files.writeString(java.nio.file.Path.of("debug.txt"),
                                        "User found: " + user.getEmail() + " Role: " + user.getRole() + "\n",
                                        java.nio.file.StandardOpenOption.CREATE,
                                        java.nio.file.StandardOpenOption.APPEND);
                } catch (Exception e) {
                }

                GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

                return new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                user.isEnabled(),
                                true,
                                true,
                                true,
                                Collections.singletonList(authority));
        }
}
