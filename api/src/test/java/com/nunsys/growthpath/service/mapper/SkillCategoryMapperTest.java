package com.nunsys.growthpath.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SkillCategoryMapperTest {

    private SkillCategoryMapper skillCategoryMapper;

    @BeforeEach
    public void setUp() {
        skillCategoryMapper = new SkillCategoryMapperImpl();
    }
}
