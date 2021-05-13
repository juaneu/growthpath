package com.nunsys.growthpath.service.mapper;

import com.nunsys.growthpath.domain.*;
import com.nunsys.growthpath.service.dto.SkillCategoryDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SkillCategory} and its DTO {@link SkillCategoryDTO}.
 */
@Mapper(componentModel = "spring", uses = { UnitMapper.class })
public interface SkillCategoryMapper extends EntityMapper<SkillCategoryDTO, SkillCategory> {
    @Mapping(target = "unit", source = "unit", qualifiedByName = "name")
    SkillCategoryDTO toDto(SkillCategory s);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    SkillCategoryDTO toDtoName(SkillCategory skillCategory);
}
