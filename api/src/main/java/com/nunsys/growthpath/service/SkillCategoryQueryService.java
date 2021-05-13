package com.nunsys.growthpath.service;

import com.nunsys.growthpath.domain.*; // for static metamodels
import com.nunsys.growthpath.domain.SkillCategory;
import com.nunsys.growthpath.repository.SkillCategoryRepository;
import com.nunsys.growthpath.service.criteria.SkillCategoryCriteria;
import com.nunsys.growthpath.service.dto.SkillCategoryDTO;
import com.nunsys.growthpath.service.mapper.SkillCategoryMapper;
import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link SkillCategory} entities in the database.
 * The main input is a {@link SkillCategoryCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link SkillCategoryDTO} or a {@link Page} of {@link SkillCategoryDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class SkillCategoryQueryService extends QueryService<SkillCategory> {

    private final Logger log = LoggerFactory.getLogger(SkillCategoryQueryService.class);

    private final SkillCategoryRepository skillCategoryRepository;

    private final SkillCategoryMapper skillCategoryMapper;

    public SkillCategoryQueryService(SkillCategoryRepository skillCategoryRepository, SkillCategoryMapper skillCategoryMapper) {
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillCategoryMapper = skillCategoryMapper;
    }

    /**
     * Return a {@link List} of {@link SkillCategoryDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<SkillCategoryDTO> findByCriteria(SkillCategoryCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<SkillCategory> specification = createSpecification(criteria);
        return skillCategoryMapper.toDto(skillCategoryRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link SkillCategoryDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<SkillCategoryDTO> findByCriteria(SkillCategoryCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<SkillCategory> specification = createSpecification(criteria);
        return skillCategoryRepository.findAll(specification, page).map(skillCategoryMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(SkillCategoryCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<SkillCategory> specification = createSpecification(criteria);
        return skillCategoryRepository.count(specification);
    }

    /**
     * Function to convert {@link SkillCategoryCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<SkillCategory> createSpecification(SkillCategoryCriteria criteria) {
        Specification<SkillCategory> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), SkillCategory_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), SkillCategory_.name));
            }
            if (criteria.getSkillsId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getSkillsId(), root -> root.join(SkillCategory_.skills, JoinType.LEFT).get(Skill_.id))
                    );
            }
            if (criteria.getUnitId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getUnitId(), root -> root.join(SkillCategory_.unit, JoinType.LEFT).get(Unit_.id))
                    );
            }
        }
        return specification;
    }
}
