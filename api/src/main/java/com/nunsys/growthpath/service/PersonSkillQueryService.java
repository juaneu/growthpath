package com.nunsys.growthpath.service;

import com.nunsys.growthpath.domain.*; // for static metamodels
import com.nunsys.growthpath.domain.PersonSkill;
import com.nunsys.growthpath.repository.PersonSkillRepository;
import com.nunsys.growthpath.service.criteria.PersonSkillCriteria;
import com.nunsys.growthpath.service.dto.PersonSkillDTO;
import com.nunsys.growthpath.service.mapper.PersonSkillMapper;
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
 * Service for executing complex queries for {@link PersonSkill} entities in the database.
 * The main input is a {@link PersonSkillCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link PersonSkillDTO} or a {@link Page} of {@link PersonSkillDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class PersonSkillQueryService extends QueryService<PersonSkill> {

    private final Logger log = LoggerFactory.getLogger(PersonSkillQueryService.class);

    private final PersonSkillRepository personSkillRepository;

    private final PersonSkillMapper personSkillMapper;

    public PersonSkillQueryService(PersonSkillRepository personSkillRepository, PersonSkillMapper personSkillMapper) {
        this.personSkillRepository = personSkillRepository;
        this.personSkillMapper = personSkillMapper;
    }

    /**
     * Return a {@link List} of {@link PersonSkillDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<PersonSkillDTO> findByCriteria(PersonSkillCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<PersonSkill> specification = createSpecification(criteria);
        return personSkillMapper.toDto(personSkillRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link PersonSkillDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<PersonSkillDTO> findByCriteria(PersonSkillCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<PersonSkill> specification = createSpecification(criteria);
        return personSkillRepository.findAll(specification, page).map(personSkillMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(PersonSkillCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<PersonSkill> specification = createSpecification(criteria);
        return personSkillRepository.count(specification);
    }

    /**
     * Function to convert {@link PersonSkillCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<PersonSkill> createSpecification(PersonSkillCriteria criteria) {
        Specification<PersonSkill> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), PersonSkill_.id));
            }
            if (criteria.getLevel() != null) {
                specification = specification.and(buildSpecification(criteria.getLevel(), PersonSkill_.level));
            }
            if (criteria.getPersonId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getPersonId(), root -> root.join(PersonSkill_.person, JoinType.LEFT).get(Person_.id))
                    );
            }
            if (criteria.getSkillId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getSkillId(), root -> root.join(PersonSkill_.skill, JoinType.LEFT).get(Skill_.id))
                    );
            }
        }
        return specification;
    }
}
