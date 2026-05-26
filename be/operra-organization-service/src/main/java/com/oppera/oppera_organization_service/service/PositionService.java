package com.oppera.oppera_organization_service.service;

import com.oppera.oppera_organization_service.dto.request.PositionRequest;
import com.oppera.oppera_organization_service.dto.response.PositionResponse;
import com.oppera.oppera_organization_service.entity.Position;
import com.oppera.oppera_organization_service.mapper.PositionMapper;
import com.oppera.oppera_organization_service.repository.PositionRepository;
import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PositionService {
    PositionRepository positionRepository;
    PositionMapper positionMapper;

    public PositionResponse create(PositionRequest request) {
        var position = positionMapper.toPosition(request);
        position = positionRepository.save(position);
        return positionMapper.toPositionResponse(position);
    }

    public List<PositionResponse> getAll(String level) {
        var positions = level == null || level.isBlank()
                ? positionRepository.findAll()
                : positionRepository.findByLevel(level);

        return positions.stream()
                .map(positionMapper::toPositionResponse)
                .toList();
    }

    public PositionResponse getById(String positionId) {
        return positionMapper.toPositionResponse(findEntityById(positionId));
    }

    public PositionResponse update(String positionId, PositionRequest request) {
        var position = findEntityById(positionId);
        positionMapper.updatePosition(position, request);
        position = positionRepository.save(position);
        return positionMapper.toPositionResponse(position);
    }

    public void delete(String positionId) {
        positionRepository.delete(findEntityById(positionId));
    }

    public Position findEntityById(String positionId) {
        return positionRepository.findById(positionId)
                .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
    }
}
