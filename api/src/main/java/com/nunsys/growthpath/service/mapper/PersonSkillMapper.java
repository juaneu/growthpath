package com.nunsys.growthpath.service.mapper;

import com.nunsys.growthpath.domain.*;
import com.nunsys.growthpath.service.dto.PersonSkillDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PersonSkill} and its DTO {@link PersonSkillDTO}.
 */
@Mapper(componentModel = "spring", uses = { PersonMapper.class, SkillMapper.class })
public interface PersonSkillMapper extends EntityMapper<PersonSkillDTO, PersonSkill> {
    @Mapping(target = "person", source = "person", qualifiedByName = "name")
    @Mapping(target = "skill", source = "skill", qualifiedByName = "name")
    PersonSkillDTO toDto(PersonSkill s);
}
