package com.nunsys.growthpath.service.impl;

import com.nunsys.growthpath.domain.PersonSkill;
import com.nunsys.growthpath.repository.PersonSkillRepository;
import com.nunsys.growthpath.service.PersonSkillService;
import com.nunsys.growthpath.service.dto.PersonSkillDTO;
import com.nunsys.growthpath.service.mapper.PersonSkillMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link PersonSkill}.
 */
@Service
@Transactional
public class PersonSkillServiceImpl implements PersonSkillService {

    private final Logger log = LoggerFactory.getLogger(PersonSkillServiceImpl.class);

    private final PersonSkillRepository personSkillRepository;

    private final PersonSkillMapper personSkillMapper;

    public PersonSkillServiceImpl(PersonSkillRepository personSkillRepository, PersonSkillMapper personSkillMapper) {
        this.personSkillRepository = personSkillRepository;
        this.personSkillMapper = personSkillMapper;
    }

    @Override
    public PersonSkillDTO save(PersonSkillDTO personSkillDTO) {
        log.debug("Request to save PersonSkill : {}", personSkillDTO);
        PersonSkill personSkill = personSkillMapper.toEntity(personSkillDTO);
        personSkill = personSkillRepository.save(personSkill);
        return personSkillMapper.toDto(personSkill);
    }

    @Override
    public Optional<PersonSkillDTO> partialUpdate(PersonSkillDTO personSkillDTO) {
        log.debug("Request to partially update PersonSkill : {}", personSkillDTO);

        return personSkillRepository
            .findById(personSkillDTO.getId())
            .map(
                existingPersonSkill -> {
                    personSkillMapper.partialUpdate(existingPersonSkill, personSkillDTO);
                    return existingPersonSkill;
                }
            )
            .map(personSkillRepository::save)
            .map(personSkillMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PersonSkillDTO> findAll(Pageable pageable) {
        log.debug("Request to get all PersonSkills");
        return personSkillRepository.findAll(pageable).map(personSkillMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PersonSkillDTO> findOne(Long id) {
        log.debug("Request to get PersonSkill : {}", id);
        return personSkillRepository.findById(id).map(personSkillMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete PersonSkill : {}", id);
        personSkillRepository.deleteById(id);
    }
}
