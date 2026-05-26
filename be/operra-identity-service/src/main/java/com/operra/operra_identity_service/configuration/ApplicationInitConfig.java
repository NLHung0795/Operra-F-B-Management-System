package com.example.curdandmysql.configuration;

import com.example.curdandmysql.constant.PredefinedRole;
import com.example.curdandmysql.entity.Role;
import com.example.curdandmysql.entity.User;
import com.example.curdandmysql.repository.RoleRepository;
import com.example.curdandmysql.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor // tu tao constructor cho cac bien ma dc define la final -> ko can autowired nua
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // neu cac bien ko dc xdinh cu the chi dinh truy cap thi mac dinh se la private final
@Configuration
@Slf4j //giúp bạn log dễ dàng hơn, không cần khởi tạo Logger thủ công.
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository){ // ApplicationRunner se dc khoi chay moi khi app dc khoi dong
        return args -> {
            if (userRepository.findUserByUsername(ADMIN_USER_NAME).isEmpty()) {
                roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER_ROLE)
                        .description("User role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}
