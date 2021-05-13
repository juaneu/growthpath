package com.nunsys.growthpath.service.mapper;

import com.nunsys.growthpath.domain.*;
import com.nunsys.growthpath.service.dto.PersonDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Person} and its DTO {@link PersonDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class, UnitMapper.class })
public interface PersonMapper extends EntityMapper<PersonDTO, Person> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    @Mapping(target = "area", source = "area", qualifiedByName = "name")
    PersonDTO toDto(Person s);

    @Named("name")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "name", source = "name")
    PersonDTO toDtoName(Person person);
}
