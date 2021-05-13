package com.nunsys.growthpath.service;

import com.nunsys.growthpath.service.dto.PersonSkillDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.nunsys.growthpath.domain.PersonSkill}.
 */
public interface PersonSkillService {
    /**
     * Save a personSkill.
     *
     * @param personSkillDTO the entity to save.
     * @return the persisted entity.
     */
    PersonSkillDTO save(PersonSkillDTO personSkillDTO);

    /**
     * Partially updates a personSkill.
     *
     * @param personSkillDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PersonSkillDTO> partialUpdate(PersonSkillDTO personSkillDTO);

    /**
     * Get all the personSkills.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<PersonSkillDTO> findAll(Pageable pageable);

    /**
     * Get the "id" personSkill.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PersonSkillDTO> findOne(Long id);

    /**
     * Delete the "id" personSkill.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
