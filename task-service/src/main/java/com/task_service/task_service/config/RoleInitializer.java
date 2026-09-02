package com.task_service.task_service.config;

import com.task_service.task_service.entity.Role;
import com.task_service.task_service.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoleInitializer implements CommandLineRunner {

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

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        for (String roleName : DEFAULT_ROLES) {
            if (roleRepository.findByName(roleName) == null) {
                Role role = new Role();
                role.setName(roleName);
                role.setPermissions(List.of());
                roleRepository.save(role);
            }
        }
    }
}
