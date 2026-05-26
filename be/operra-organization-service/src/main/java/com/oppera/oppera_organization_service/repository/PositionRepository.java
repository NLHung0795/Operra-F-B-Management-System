package com.oppera.oppera_organization_service.repository;

import com.oppera.oppera_organization_service.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PositionRepository extends JpaRepository<Position, String> {
    List<Position> findByLevel(String level);
}
