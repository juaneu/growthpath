package com.nunsys.growthpath.repository;

import com.nunsys.growthpath.domain.SkillCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SkillCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long>, JpaSpecificationExecutor<SkillCategory> {}
