package com.oppera.oppera_organization_service.mapper;

import com.oppera.oppera_organization_service.dto.request.PositionRequest;
import com.oppera.oppera_organization_service.dto.response.PositionResponse;
import com.oppera.oppera_organization_service.entity.Position;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PositionMapper {
    @Mapping(target = "employees", ignore = true)
    Position toPosition(PositionRequest request);

    PositionResponse toPositionResponse(Position position);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employees", ignore = true)
    void updatePosition(@MappingTarget Position position, PositionRequest request);
}
