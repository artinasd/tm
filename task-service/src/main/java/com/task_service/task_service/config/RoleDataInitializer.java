package com.task_service.task_service.config;

import com.task_service.task_service.entity.Role;
import com.task_service.task_service.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class RoleDataInitializer {

    private static final List<String> DEFAULT_ROLES = List.of(
            "ADMIN",
            "MANAGER",
            "TEAM_LEAD",
            "EMPLOYEE",
            "SUPERVISOR",
            "PROJECT_MANAGER",
            "VIEWER",
            "GUEST"
    );

    @Bean
    CommandLineRunner initializeRoles(RoleRepository roleRepository) {
        return args -> {
            for (String roleName : DEFAULT_ROLES) {
                if (roleRepository.findByName(roleName) == null) {
                    Role role = new Role();
                    role.setName(roleName);
                    role.setPermissions(List.of());
                    roleRepository.save(role);
                }
            }
        };
    }
}
