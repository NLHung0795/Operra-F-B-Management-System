package com.operra.operra_identity_service.configuration;

import com.operra.operra_identity_service.constant.PredefinedRole;
import com.operra.operra_identity_service.entity.Role;
import com.operra.operra_identity_service.entity.UserAccount;
import com.operra.operra_identity_service.repository.RoleRepository;
import com.operra.operra_identity_service.repository.UserAccountRepository;
import com.operra.operra_identity_service.entity.Permission;
import com.operra.operra_identity_service.repository.PermissionRepository;
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
    ApplicationRunner applicationRunner(UserAccountRepository userAccountRepository, RoleRepository roleRepository, PermissionRepository permissionRepository){
        return args -> {
            log.info("Starting database initialization...");

            // 1. Initialize all permissions
            String[][] permissionDefs = {
                // Identity
                {"CREATE_ROLE", "Create a new role"},
                {"VIEW_ROLE", "View role details"},
                {"UPDATE_ROLE", "Update an existing role"},
                {"DELETE_ROLE", "Delete a role"},
                {"CREATE_PERMISSION", "Create a new permission"},
                {"VIEW_PERMISSION", "View permissions list"},
                {"VIEW_USER_ACCOUNTS", "View all user accounts"},
                {"MANAGE_USER_ACCOUNTS", "Manage user accounts and details"},
                
                // Organization
                {"MANAGE_COMPANY", "Manage company settings"},
                {"MANAGE_BRANCH", "Manage branches"},
                {"MANAGE_DEPARTMENT", "Manage departments"},
                {"MANAGE_POSITION", "Manage positions"},
                {"VIEW_EMPLOYEE", "View employee profiles"},
                {"MANAGE_EMPLOYEE", "Manage employees"},

                // Scheduling
                {"MANAGE_WORK_ASSIGNMENT", "Manage work assignment templates"},
                {"VIEW_SHIFT_ASSIGNMENT", "View shift assignments"},
                {"MANAGE_SHIFT_ASSIGNMENT", "Assign and manage shifts for employees"},
                {"VIEW_ATTENDANCE", "View branch attendance reports"},
                {"MANAGE_ATTENDANCE", "Manually adjust attendance records"},
                {"ATTENDANCE_CHECK", "Self check-in and check-out"},

                // Leaves
                {"SUBMIT_LEAVE_REQUEST", "Submit personal leave request"},
                {"APPROVE_LEAVE_REQUEST", "Approve or reject employee leave requests"},
                {"VIEW_LEAVE_REQUEST", "View leave requests"},

                // POS
                {"OPEN_CLOSE_CASH_SESSION", "Open and close cash sessions"},
                {"VIEW_CASH_SESSION", "View cash session details"},
                {"CREATE_ORDER", "Create new orders"},
                {"VIEW_ORDER", "View order details"},
                {"UPDATE_ORDER", "Update orders (add items, change table)"},
                {"CANCEL_ORDER", "Cancel unpaid orders"},
                {"MANAGE_INVOICE", "Manage payments and invoices"},

                // Finance & Payroll
                {"MANAGE_EXPENSE", "Create and manage expenses"},
                {"VIEW_EXPENSE", "View expense details"},
                {"MANAGE_PAYROLL", "Calculate and manage payroll"},
                {"VIEW_PERSONAL_PAYROLL", "View personal payslip"},
                {"VIEW_KPI", "View performance indicators"}
            };

            for (String[] def : permissionDefs) {
                String name = def[0];
                String desc = def[1];
                if (!permissionRepository.existsById(name)) {
                    permissionRepository.save(Permission.builder()
                            .name(name)
                            .description(desc)
                            .build());
                }
            }

            // 2. Initialize Roles and their Permissions mapping
            // ADMIN role
            Set<Permission> adminPerms = new HashSet<>(permissionRepository.findAll());
            
            // MANAGER role
            Set<String> managerPermNames = Set.of(
                "VIEW_EMPLOYEE", "MANAGE_EMPLOYEE",
                "MANAGE_WORK_ASSIGNMENT", "VIEW_SHIFT_ASSIGNMENT", "MANAGE_SHIFT_ASSIGNMENT",
                "VIEW_ATTENDANCE", "MANAGE_ATTENDANCE", "ATTENDANCE_CHECK",
                "SUBMIT_LEAVE_REQUEST", "APPROVE_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
                "OPEN_CLOSE_CASH_SESSION", "VIEW_CASH_SESSION",
                "CREATE_ORDER", "VIEW_ORDER", "UPDATE_ORDER", "CANCEL_ORDER", "MANAGE_INVOICE",
                "MANAGE_EXPENSE", "VIEW_EXPENSE", "MANAGE_PAYROLL", "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
            );
            Set<Permission> managerPerms = new HashSet<>();
            for (String pName : managerPermNames) {
                permissionRepository.findById(pName).ifPresent(managerPerms::add);
            }

            // CASHIER role
            Set<String> cashierPermNames = Set.of(
                "ATTENDANCE_CHECK",
                "SUBMIT_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
                "OPEN_CLOSE_CASH_SESSION", "VIEW_CASH_SESSION",
                "CREATE_ORDER", "VIEW_ORDER", "UPDATE_ORDER", "CANCEL_ORDER", "MANAGE_INVOICE",
                "MANAGE_EXPENSE", "VIEW_EXPENSE", "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
            );
            Set<Permission> cashierPerms = new HashSet<>();
            for (String pName : cashierPermNames) {
                permissionRepository.findById(pName).ifPresent(cashierPerms::add);
            }

            // EMPLOYEE role
            Set<String> employeePermNames = Set.of(
                "ATTENDANCE_CHECK",
                "SUBMIT_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
                "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
            );
            Set<Permission> employeePerms = new HashSet<>();
            for (String pName : employeePermNames) {
                permissionRepository.findById(pName).ifPresent(employeePerms::add);
            }

            // KITCHEN role
            Set<String> kitchenPermNames = Set.of(
                "ATTENDANCE_CHECK",
                "SUBMIT_LEAVE_REQUEST", "VIEW_LEAVE_REQUEST",
                "VIEW_PERSONAL_PAYROLL", "VIEW_KPI"
            );
            Set<Permission> kitchenPerms = new HashSet<>();
            for (String pName : kitchenPermNames) {
                permissionRepository.findById(pName).ifPresent(kitchenPerms::add);
            }

            // Update or create roles
            updateOrCreateRole(roleRepository, PredefinedRole.ADMIN_ROLE, "Admin role", adminPerms);
            updateOrCreateRole(roleRepository, PredefinedRole.MANAGER_ROLE, "Manager role", managerPerms);
            updateOrCreateRole(roleRepository, PredefinedRole.CASHIER_ROLE, "Cashier role", cashierPerms);
            updateOrCreateRole(roleRepository, PredefinedRole.KITCHEN_ROLE, "Kitchen role", kitchenPerms);
            updateOrCreateRole(roleRepository, PredefinedRole.EMPLOYEE_ROLE, "Employee role", employeePerms);

            // Delete USER role if it exists
            if(roleRepository.existsById("USER")) {
                roleRepository.deleteById("USER");
            }


            if(userAccountRepository.findUserAccountByUsername(ADMIN_USER_NAME).isEmpty()){
                Role adminRole = roleRepository.findById(PredefinedRole.ADMIN_ROLE)
                        .orElseThrow(() -> new IllegalStateException("ADMIN role not found"));

                HashSet<Role> roles = new HashSet<>();
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

    private void updateOrCreateRole(RoleRepository roleRepository, String name, String description, Set<Permission> permissions) {
        Role role = roleRepository.findById(name).orElse(null);
        if (role == null) {
            role = Role.builder()
                    .name(name)
                    .description(description)
                    .permissions(permissions)
                    .build();
            roleRepository.save(role);
        } else {
            role.setPermissions(permissions);
            roleRepository.save(role);
        }
    }
}
