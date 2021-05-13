package com.nunsys.growthpath.service.mapper;

import com.nunsys.growthpath.domain.*;
import com.nunsys.growthpath.service.dto.SkillDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Skill} and its DTO {@link SkillDTO}.
 */
@Mapper(componentModel = "spring", uses = { SkillCategoryMapper.class })
public interface SkillMapper extends EntityMapper<SkillDTO, Skill> {
    @Mapping(target = "skillCategory", source = "skillCategory", qualifiedByName = "name")
    SkillDTO toDto(Skill s);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    SkillDTO toDtoName(Skill skill);
}
