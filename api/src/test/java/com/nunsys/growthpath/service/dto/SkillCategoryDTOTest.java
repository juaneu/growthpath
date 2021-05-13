package com.nunsys.growthpath.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.nunsys.growthpath.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SkillCategoryDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SkillCategoryDTO.class);
        SkillCategoryDTO skillCategoryDTO1 = new SkillCategoryDTO();
        skillCategoryDTO1.setId(1L);
        SkillCategoryDTO skillCategoryDTO2 = new SkillCategoryDTO();
        assertThat(skillCategoryDTO1).isNotEqualTo(skillCategoryDTO2);
        skillCategoryDTO2.setId(skillCategoryDTO1.getId());
        assertThat(skillCategoryDTO1).isEqualTo(skillCategoryDTO2);
        skillCategoryDTO2.setId(2L);
        assertThat(skillCategoryDTO1).isNotEqualTo(skillCategoryDTO2);
        skillCategoryDTO1.setId(null);
        assertThat(skillCategoryDTO1).isNotEqualTo(skillCategoryDTO2);
    }
}
