package com.operra.operra_identity_service.repository;

import com.operra.operra_identity_service.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
    boolean existsByUsername(String username);
}
