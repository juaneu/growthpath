package com.nunsys.growthpath.service.mapper;

import com.nunsys.growthpath.domain.*;
import com.nunsys.growthpath.service.dto.DocumentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Document} and its DTO {@link DocumentDTO}.
 */
@Mapper(componentModel = "spring", uses = { DocumentTypeMapper.class, PersonMapper.class })
public interface DocumentMapper extends EntityMapper<DocumentDTO, Document> {
    @Mapping(target = "type", source = "type", qualifiedByName = "id")
    @Mapping(target = "person", source = "person", qualifiedByName = "name")
    DocumentDTO toDto(Document s);
}
