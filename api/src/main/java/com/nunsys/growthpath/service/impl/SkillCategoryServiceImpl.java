package com.nunsys.growthpath.service.impl;

import com.nunsys.growthpath.domain.SkillCategory;
import com.nunsys.growthpath.repository.SkillCategoryRepository;
import com.nunsys.growthpath.service.SkillCategoryService;
import com.nunsys.growthpath.service.dto.SkillCategoryDTO;
import com.nunsys.growthpath.service.mapper.SkillCategoryMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SkillCategory}.
 */
@Service
@Transactional
public class SkillCategoryServiceImpl implements SkillCategoryService {

    private final Logger log = LoggerFactory.getLogger(SkillCategoryServiceImpl.class);

    private final SkillCategoryRepository skillCategoryRepository;

    private final SkillCategoryMapper skillCategoryMapper;

    public SkillCategoryServiceImpl(SkillCategoryRepository skillCategoryRepository, SkillCategoryMapper skillCategoryMapper) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillCategoryMapper = skillCategoryMapper;
    }

    @Override
    public SkillCategoryDTO save(SkillCategoryDTO skillCategoryDTO) {
        log.debug("Request to save SkillCategory : {}", skillCategoryDTO);
        SkillCategory skillCategory = skillCategoryMapper.toEntity(skillCategoryDTO);
        skillCategory = skillCategoryRepository.save(skillCategory);
        return skillCategoryMapper.toDto(skillCategory);
    }

    @Override
    public Optional<SkillCategoryDTO> partialUpdate(SkillCategoryDTO skillCategoryDTO) {
        log.debug("Request to partially update SkillCategory : {}", skillCategoryDTO);

        return skillCategoryRepository
            .findById(skillCategoryDTO.getId())
            .map(
                existingSkillCategory -> {
                    skillCategoryMapper.partialUpdate(existingSkillCategory, skillCategoryDTO);
                    return existingSkillCategory;
                }
            )
            .map(skillCategoryRepository::save)
            .map(skillCategoryMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillCategoryDTO> findAll(Pageable pageable) {
        log.debug("Request to get all SkillCategories");
        return skillCategoryRepository.findAll(pageable).map(skillCategoryMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SkillCategoryDTO> findOne(Long id) {
        log.debug("Request to get SkillCategory : {}", id);
        return skillCategoryRepository.findById(id).map(skillCategoryMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SkillCategory : {}", id);
        skillCategoryRepository.deleteById(id);
    }
}
