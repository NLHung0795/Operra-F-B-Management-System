package com.operra.operra_identity_service.configuration;

import com.operra.operra_identity_service.constant.PredefinedRole;
import com.operra.operra_identity_service.entity.Role;
import com.operra.operra_identity_service.entity.UserAccount;
import com.operra.operra_identity_service.repository.RoleRepository;
import com.operra.operra_identity_service.repository.UserAccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.HashSet;

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
    ApplicationRunner applicationRunner(UserAccountRepository userAccountRepository, RoleRepository roleRepository){
        return args -> {
            if(userAccountRepository.findUserAccountByUsername(ADMIN_USER_NAME).isEmpty()){
                roleRepository.save(Role.builder()
                                .name(PredefinedRole.USER_ROLE)
                                .description("User role")
                        .build());

                var adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build());
                HashSet roles = new HashSet<>();
                roles.add(adminRole);

                UserAccount userAccount = UserAccount.builder()
                        .creationDate(Instant.now())
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();
                userAccountRepository.save(userAccount);
                log.warn("admin user has been created with default password: admin, please change it");

            }
            log.info("Application initialization completed .....");

        };
    }
}
