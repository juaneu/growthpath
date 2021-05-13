package com.nunsys.growthpath.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.nunsys.growthpath.IntegrationTest;
import com.nunsys.growthpath.domain.Skill;
import com.nunsys.growthpath.domain.SkillCategory;
import com.nunsys.growthpath.domain.Unit;
import com.nunsys.growthpath.repository.SkillCategoryRepository;
import com.nunsys.growthpath.service.criteria.SkillCategoryCriteria;
import com.nunsys.growthpath.service.dto.SkillCategoryDTO;
import com.nunsys.growthpath.service.mapper.SkillCategoryMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SkillCategoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SkillCategoryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/skill-categories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private SkillCategoryMapper skillCategoryMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSkillCategoryMockMvc;

    private SkillCategory skillCategory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SkillCategory createEntity(EntityManager em) {
        SkillCategory skillCategory = new SkillCategory().name(DEFAULT_NAME);
        return skillCategory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SkillCategory createUpdatedEntity(EntityManager em) {
        SkillCategory skillCategory = new SkillCategory().name(UPDATED_NAME);
        return skillCategory;
    }

    @BeforeEach
    public void initTest() {
        skillCategory = createEntity(em);
    }

    @Test
    @Transactional
    void createSkillCategory() throws Exception {
        int databaseSizeBeforeCreate = skillCategoryRepository.findAll().size();
        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);
        restSkillCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isCreated());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeCreate + 1);
        SkillCategory testSkillCategory = skillCategoryList.get(skillCategoryList.size() - 1);
        assertThat(testSkillCategory.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createSkillCategoryWithExistingId() throws Exception {
        // Create the SkillCategory with an existing ID
        skillCategory.setId(1L);
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        int databaseSizeBeforeCreate = skillCategoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSkillCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = skillCategoryRepository.findAll().size();
        // set the field null
        skillCategory.setName(null);

        // Create the SkillCategory, which fails.
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        restSkillCategoryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSkillCategories() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList
        restSkillCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(skillCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getSkillCategory() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get the skillCategory
        restSkillCategoryMockMvc
            .perform(get(ENTITY_API_URL_ID, skillCategory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(skillCategory.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getSkillCategoriesByIdFiltering() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        Long id = skillCategory.getId();

        defaultSkillCategoryShouldBeFound("id.equals=" + id);
        defaultSkillCategoryShouldNotBeFound("id.notEquals=" + id);

        defaultSkillCategoryShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultSkillCategoryShouldNotBeFound("id.greaterThan=" + id);

        defaultSkillCategoryShouldBeFound("id.lessThanOrEqual=" + id);
        defaultSkillCategoryShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList where name equals to DEFAULT_NAME
        defaultSkillCategoryShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the skillCategoryList where name equals to UPDATED_NAME
        defaultSkillCategoryShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList where name not equals to DEFAULT_NAME
        defaultSkillCategoryShouldNotBeFound("name.notEquals=" + DEFAULT_NAME);

        // Get all the skillCategoryList where name not equals to UPDATED_NAME
        defaultSkillCategoryShouldBeFound("name.notEquals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByNameIsInShouldWork() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList where name in DEFAULT_NAME or UPDATED_NAME
        defaultSkillCategoryShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the skillCategoryList where name equals to UPDATED_NAME
        defaultSkillCategoryShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList where name is not null
        defaultSkillCategoryShouldBeFound("name.specified=true");

        // Get all the skillCategoryList where name is null
        defaultSkillCategoryShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByNameContainsSomething() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList where name contains DEFAULT_NAME
        defaultSkillCategoryShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the skillCategoryList where name contains UPDATED_NAME
        defaultSkillCategoryShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByNameNotContainsSomething() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        // Get all the skillCategoryList where name does not contain DEFAULT_NAME
        defaultSkillCategoryShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the skillCategoryList where name does not contain UPDATED_NAME
        defaultSkillCategoryShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllSkillCategoriesBySkillsIsEqualToSomething() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);
        Skill skills = SkillResourceIT.createEntity(em);
        em.persist(skills);
        em.flush();
        skillCategory.addSkills(skills);
        skillCategoryRepository.saveAndFlush(skillCategory);
        Long skillsId = skills.getId();

        // Get all the skillCategoryList where skills equals to skillsId
        defaultSkillCategoryShouldBeFound("skillsId.equals=" + skillsId);

        // Get all the skillCategoryList where skills equals to (skillsId + 1)
        defaultSkillCategoryShouldNotBeFound("skillsId.equals=" + (skillsId + 1));
    }

    @Test
    @Transactional
    void getAllSkillCategoriesByUnitIsEqualToSomething() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);
        Unit unit = UnitResourceIT.createEntity(em);
        em.persist(unit);
        em.flush();
        skillCategory.setUnit(unit);
        skillCategoryRepository.saveAndFlush(skillCategory);
        Long unitId = unit.getId();

        // Get all the skillCategoryList where unit equals to unitId
        defaultSkillCategoryShouldBeFound("unitId.equals=" + unitId);

        // Get all the skillCategoryList where unit equals to (unitId + 1)
        defaultSkillCategoryShouldNotBeFound("unitId.equals=" + (unitId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultSkillCategoryShouldBeFound(String filter) throws Exception {
        restSkillCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(skillCategory.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));

        // Check, that the count call also returns 1
        restSkillCategoryMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultSkillCategoryShouldNotBeFound(String filter) throws Exception {
        restSkillCategoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restSkillCategoryMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingSkillCategory() throws Exception {
        // Get the skillCategory
        restSkillCategoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSkillCategory() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();

        // Update the skillCategory
        SkillCategory updatedSkillCategory = skillCategoryRepository.findById(skillCategory.getId()).get();
        // Disconnect from session so that the updates on updatedSkillCategory are not directly saved in db
        em.detach(updatedSkillCategory);
        updatedSkillCategory.name(UPDATED_NAME);
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(updatedSkillCategory);

        restSkillCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, skillCategoryDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isOk());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
        SkillCategory testSkillCategory = skillCategoryList.get(skillCategoryList.size() - 1);
        assertThat(testSkillCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingSkillCategory() throws Exception {
        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();
        skillCategory.setId(count.incrementAndGet());

        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSkillCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, skillCategoryDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSkillCategory() throws Exception {
        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();
        skillCategory.setId(count.incrementAndGet());

        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSkillCategoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSkillCategory() throws Exception {
        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();
        skillCategory.setId(count.incrementAndGet());

        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSkillCategoryMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSkillCategoryWithPatch() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();

        // Update the skillCategory using partial update
        SkillCategory partialUpdatedSkillCategory = new SkillCategory();
        partialUpdatedSkillCategory.setId(skillCategory.getId());

        partialUpdatedSkillCategory.name(UPDATED_NAME);

        restSkillCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSkillCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSkillCategory))
            )
            .andExpect(status().isOk());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
        SkillCategory testSkillCategory = skillCategoryList.get(skillCategoryList.size() - 1);
        assertThat(testSkillCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateSkillCategoryWithPatch() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();

        // Update the skillCategory using partial update
        SkillCategory partialUpdatedSkillCategory = new SkillCategory();
        partialUpdatedSkillCategory.setId(skillCategory.getId());

        partialUpdatedSkillCategory.name(UPDATED_NAME);

        restSkillCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSkillCategory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSkillCategory))
            )
            .andExpect(status().isOk());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
        SkillCategory testSkillCategory = skillCategoryList.get(skillCategoryList.size() - 1);
        assertThat(testSkillCategory.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingSkillCategory() throws Exception {
        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();
        skillCategory.setId(count.incrementAndGet());

        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSkillCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, skillCategoryDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSkillCategory() throws Exception {
        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();
        skillCategory.setId(count.incrementAndGet());

        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSkillCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSkillCategory() throws Exception {
        int databaseSizeBeforeUpdate = skillCategoryRepository.findAll().size();
        skillCategory.setId(count.incrementAndGet());

        // Create the SkillCategory
        SkillCategoryDTO skillCategoryDTO = skillCategoryMapper.toDto(skillCategory);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSkillCategoryMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(skillCategoryDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SkillCategory in the database
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSkillCategory() throws Exception {
        // Initialize the database
        skillCategoryRepository.saveAndFlush(skillCategory);

        int databaseSizeBeforeDelete = skillCategoryRepository.findAll().size();

        // Delete the skillCategory
        restSkillCategoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, skillCategory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SkillCategory> skillCategoryList = skillCategoryRepository.findAll();
        assertThat(skillCategoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
