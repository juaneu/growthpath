package com.nunsys.growthpath.service.mapper;

import com.nunsys.growthpath.domain.*;
import com.nunsys.growthpath.service.dto.UnitDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Unit} and its DTO {@link UnitDTO}.
 */
@Mapper(componentModel = "spring", uses = { PersonMapper.class, OrganizationMapper.class })
public interface UnitMapper extends EntityMapper<UnitDTO, Unit> {
    @Mapping(target = "responsable", source = "responsable", qualifiedByName = "name")
    @Mapping(target = "organization", source = "organization", qualifiedByName = "name")
    UnitDTO toDto(Unit s);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    UnitDTO toDtoName(Unit unit);
}
