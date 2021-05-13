package com.nunsys.growthpath.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PersonSkillMapperTest {

    private PersonSkillMapper personSkillMapper;

    @BeforeEach
    public void setUp() {
        personSkillMapper = new PersonSkillMapperImpl();
    }
}
