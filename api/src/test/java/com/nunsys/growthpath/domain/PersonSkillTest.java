package com.nunsys.growthpath.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.nunsys.growthpath.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PersonSkillTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PersonSkill.class);
        PersonSkill personSkill1 = new PersonSkill();
        personSkill1.setId(1L);
        PersonSkill personSkill2 = new PersonSkill();
        personSkill2.setId(personSkill1.getId());
        assertThat(personSkill1).isEqualTo(personSkill2);
        personSkill2.setId(2L);
        assertThat(personSkill1).isNotEqualTo(personSkill2);
        personSkill1.setId(null);
        assertThat(personSkill1).isNotEqualTo(personSkill2);
    }
}
