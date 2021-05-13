package com.nunsys.growthpath.repository;

import com.nunsys.growthpath.domain.PersonSkill;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PersonSkill entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PersonSkillRepository extends JpaRepository<PersonSkill, Long>, JpaSpecificationExecutor<PersonSkill> {}
