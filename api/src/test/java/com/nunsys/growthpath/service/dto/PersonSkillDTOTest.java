package com.nunsys.growthpath.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.nunsys.growthpath.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PersonSkillDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PersonSkillDTO.class);
        PersonSkillDTO personSkillDTO1 = new PersonSkillDTO();
        personSkillDTO1.setId(1L);
        PersonSkillDTO personSkillDTO2 = new PersonSkillDTO();
        assertThat(personSkillDTO1).isNotEqualTo(personSkillDTO2);
        personSkillDTO2.setId(personSkillDTO1.getId());
        assertThat(personSkillDTO1).isEqualTo(personSkillDTO2);
        personSkillDTO2.setId(2L);
        assertThat(personSkillDTO1).isNotEqualTo(personSkillDTO2);
        personSkillDTO1.setId(null);
        assertThat(personSkillDTO1).isNotEqualTo(personSkillDTO2);
    }
}
