package com.nunsys.growthpath.service.impl;

import com.nunsys.growthpath.domain.Person;
import com.nunsys.growthpath.repository.PersonRepository;
import com.nunsys.growthpath.repository.UserRepository;
import com.nunsys.growthpath.service.PersonService;
import com.nunsys.growthpath.service.dto.PersonDTO;
import com.nunsys.growthpath.service.mapper.PersonMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Person}.
 */
@Service
@Transactional
public class PersonServiceImpl implements PersonService {

    private final Logger log = LoggerFactory.getLogger(PersonServiceImpl.class);

    private final PersonRepository personRepository;

    private final PersonMapper personMapper;

    private final UserRepository userRepository;

    public PersonServiceImpl(PersonRepository personRepository, PersonMapper personMapper, UserRepository userRepository) {
        this.personRepository = personRepository;
        this.personMapper = personMapper;
        this.userRepository = userRepository;
    }

    @Override
    public PersonDTO save(PersonDTO personDTO) {
        log.debug("Request to save Person : {}", personDTO);
        Person person = personMapper.toEntity(personDTO);
        Long userId = personDTO.getUser().getId();
        userRepository.findById(userId).ifPresent(person::user);
        person = personRepository.save(person);
        return personMapper.toDto(person);
    }

    @Override
    public Optional<PersonDTO> partialUpdate(PersonDTO personDTO) {
        log.debug("Request to partially update Person : {}", personDTO);

        return personRepository
            .findById(personDTO.getId())
            .map(
                existingPerson -> {
                    personMapper.partialUpdate(existingPerson, personDTO);
                    return existingPerson;
                }
            )
            .map(personRepository::save)
            .map(personMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PersonDTO> findAll(Pageable pageable) {
        log.debug("Request to get all People");
        return personRepository.findAll(pageable).map(personMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PersonDTO> findOne(Long id) {
        log.debug("Request to get Person : {}", id);
        return personRepository.findById(id).map(personMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Person : {}", id);
        personRepository.deleteById(id);
    }
}
