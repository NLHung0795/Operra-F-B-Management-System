package com.operra.operra_identity_service.repository;

import com.operra.operra_identity_service.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
    boolean existsByUsername(String username);

    Object findByUsername(String username);

    Optional<UserAccount> findUserAccountByUsername(String username);
}
