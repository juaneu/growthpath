package com.nunsys.growthpath.service;

import com.nunsys.growthpath.service.dto.SkillCategoryDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.nunsys.growthpath.domain.SkillCategory}.
 */
public interface SkillCategoryService {
    /**
     * Save a skillCategory.
     *
     * @param skillCategoryDTO the entity to save.
     * @return the persisted entity.
     */
    SkillCategoryDTO save(SkillCategoryDTO skillCategoryDTO);

    /**
     * Partially updates a skillCategory.
     *
     * @param skillCategoryDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SkillCategoryDTO> partialUpdate(SkillCategoryDTO skillCategoryDTO);

    /**
     * Get all the skillCategories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SkillCategoryDTO> findAll(Pageable pageable);

    /**
     * Get the "id" skillCategory.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SkillCategoryDTO> findOne(Long id);

    /**
     * Delete the "id" skillCategory.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
