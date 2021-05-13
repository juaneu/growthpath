package com.nunsys.growthpath.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.nunsys.growthpath.IntegrationTest;
import com.nunsys.growthpath.domain.Person;
import com.nunsys.growthpath.domain.PersonSkill;
import com.nunsys.growthpath.domain.Skill;
import com.nunsys.growthpath.domain.enumeration.SkillLevel;
import com.nunsys.growthpath.repository.PersonSkillRepository;
import com.nunsys.growthpath.service.criteria.PersonSkillCriteria;
import com.nunsys.growthpath.service.dto.PersonSkillDTO;
import com.nunsys.growthpath.service.mapper.PersonSkillMapper;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link PersonSkillResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PersonSkillResourceIT {

    private static final String DEFAULT_COMMENTS = "AAAAAAAAAA";
    private static final String UPDATED_COMMENTS = "BBBBBBBBBB";

    private static final SkillLevel DEFAULT_LEVEL = SkillLevel.HIGHER;
    private static final SkillLevel UPDATED_LEVEL = SkillLevel.HIGH;

    private static final String ENTITY_API_URL = "/api/person-skills";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PersonSkillRepository personSkillRepository;

    @Autowired
    private PersonSkillMapper personSkillMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPersonSkillMockMvc;

    private PersonSkill personSkill;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonSkill createEntity(EntityManager em) {
        PersonSkill personSkill = new PersonSkill().comments(DEFAULT_COMMENTS).level(DEFAULT_LEVEL);
        return personSkill;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonSkill createUpdatedEntity(EntityManager em) {
        PersonSkill personSkill = new PersonSkill().comments(UPDATED_COMMENTS).level(UPDATED_LEVEL);
        return personSkill;
    }

    @BeforeEach
    public void initTest() {
        personSkill = createEntity(em);
    }

    @Test
    @Transactional
    void createPersonSkill() throws Exception {
        int databaseSizeBeforeCreate = personSkillRepository.findAll().size();
        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);
        restPersonSkillMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isCreated());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeCreate + 1);
        PersonSkill testPersonSkill = personSkillList.get(personSkillList.size() - 1);
        assertThat(testPersonSkill.getComments()).isEqualTo(DEFAULT_COMMENTS);
        assertThat(testPersonSkill.getLevel()).isEqualTo(DEFAULT_LEVEL);
    }

    @Test
    @Transactional
    void createPersonSkillWithExistingId() throws Exception {
        // Create the PersonSkill with an existing ID
        personSkill.setId(1L);
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        int databaseSizeBeforeCreate = personSkillRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonSkillMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = personSkillRepository.findAll().size();
        // set the field null
        personSkill.setLevel(null);

        // Create the PersonSkill, which fails.
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        restPersonSkillMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isBadRequest());

        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPersonSkills() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        // Get all the personSkillList
        restPersonSkillMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personSkill.getId().intValue())))
            .andExpect(jsonPath("$.[*].comments").value(hasItem(DEFAULT_COMMENTS.toString())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())));
    }

    @Test
    @Transactional
    void getPersonSkill() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        // Get the personSkill
        restPersonSkillMockMvc
            .perform(get(ENTITY_API_URL_ID, personSkill.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(personSkill.getId().intValue()))
            .andExpect(jsonPath("$.comments").value(DEFAULT_COMMENTS.toString()))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL.toString()));
    }

    @Test
    @Transactional
    void getPersonSkillsByIdFiltering() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        Long id = personSkill.getId();

        defaultPersonSkillShouldBeFound("id.equals=" + id);
        defaultPersonSkillShouldNotBeFound("id.notEquals=" + id);

        defaultPersonSkillShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultPersonSkillShouldNotBeFound("id.greaterThan=" + id);

        defaultPersonSkillShouldBeFound("id.lessThanOrEqual=" + id);
        defaultPersonSkillShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllPersonSkillsByLevelIsEqualToSomething() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        // Get all the personSkillList where level equals to DEFAULT_LEVEL
        defaultPersonSkillShouldBeFound("level.equals=" + DEFAULT_LEVEL);

        // Get all the personSkillList where level equals to UPDATED_LEVEL
        defaultPersonSkillShouldNotBeFound("level.equals=" + UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void getAllPersonSkillsByLevelIsNotEqualToSomething() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        // Get all the personSkillList where level not equals to DEFAULT_LEVEL
        defaultPersonSkillShouldNotBeFound("level.notEquals=" + DEFAULT_LEVEL);

        // Get all the personSkillList where level not equals to UPDATED_LEVEL
        defaultPersonSkillShouldBeFound("level.notEquals=" + UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void getAllPersonSkillsByLevelIsInShouldWork() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        // Get all the personSkillList where level in DEFAULT_LEVEL or UPDATED_LEVEL
        defaultPersonSkillShouldBeFound("level.in=" + DEFAULT_LEVEL + "," + UPDATED_LEVEL);

        // Get all the personSkillList where level equals to UPDATED_LEVEL
        defaultPersonSkillShouldNotBeFound("level.in=" + UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void getAllPersonSkillsByLevelIsNullOrNotNull() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        // Get all the personSkillList where level is not null
        defaultPersonSkillShouldBeFound("level.specified=true");

        // Get all the personSkillList where level is null
        defaultPersonSkillShouldNotBeFound("level.specified=false");
    }

    @Test
    @Transactional
    void getAllPersonSkillsByPersonIsEqualToSomething() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);
        Person person = PersonResourceIT.createEntity(em);
        em.persist(person);
        em.flush();
        personSkill.setPerson(person);
        personSkillRepository.saveAndFlush(personSkill);
        Long personId = person.getId();

        // Get all the personSkillList where person equals to personId
        defaultPersonSkillShouldBeFound("personId.equals=" + personId);

        // Get all the personSkillList where person equals to (personId + 1)
        defaultPersonSkillShouldNotBeFound("personId.equals=" + (personId + 1));
    }

    @Test
    @Transactional
    void getAllPersonSkillsBySkillIsEqualToSomething() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);
        Skill skill = SkillResourceIT.createEntity(em);
        em.persist(skill);
        em.flush();
        personSkill.setSkill(skill);
        personSkillRepository.saveAndFlush(personSkill);
        Long skillId = skill.getId();

        // Get all the personSkillList where skill equals to skillId
        defaultPersonSkillShouldBeFound("skillId.equals=" + skillId);

        // Get all the personSkillList where skill equals to (skillId + 1)
        defaultPersonSkillShouldNotBeFound("skillId.equals=" + (skillId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultPersonSkillShouldBeFound(String filter) throws Exception {
        restPersonSkillMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personSkill.getId().intValue())))
            .andExpect(jsonPath("$.[*].comments").value(hasItem(DEFAULT_COMMENTS.toString())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())));

        // Check, that the count call also returns 1
        restPersonSkillMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultPersonSkillShouldNotBeFound(String filter) throws Exception {
        restPersonSkillMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restPersonSkillMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingPersonSkill() throws Exception {
        // Get the personSkill
        restPersonSkillMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPersonSkill() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();

        // Update the personSkill
        PersonSkill updatedPersonSkill = personSkillRepository.findById(personSkill.getId()).get();
        // Disconnect from session so that the updates on updatedPersonSkill are not directly saved in db
        em.detach(updatedPersonSkill);
        updatedPersonSkill.comments(UPDATED_COMMENTS).level(UPDATED_LEVEL);
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(updatedPersonSkill);

        restPersonSkillMockMvc
            .perform(
                put(ENTITY_API_URL_ID, personSkillDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isOk());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
        PersonSkill testPersonSkill = personSkillList.get(personSkillList.size() - 1);
        assertThat(testPersonSkill.getComments()).isEqualTo(UPDATED_COMMENTS);
        assertThat(testPersonSkill.getLevel()).isEqualTo(UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void putNonExistingPersonSkill() throws Exception {
        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();
        personSkill.setId(count.incrementAndGet());

        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonSkillMockMvc
            .perform(
                put(ENTITY_API_URL_ID, personSkillDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPersonSkill() throws Exception {
        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();
        personSkill.setId(count.incrementAndGet());

        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonSkillMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPersonSkill() throws Exception {
        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();
        personSkill.setId(count.incrementAndGet());

        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonSkillMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personSkillDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePersonSkillWithPatch() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();

        // Update the personSkill using partial update
        PersonSkill partialUpdatedPersonSkill = new PersonSkill();
        partialUpdatedPersonSkill.setId(personSkill.getId());

        restPersonSkillMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonSkill.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonSkill))
            )
            .andExpect(status().isOk());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
        PersonSkill testPersonSkill = personSkillList.get(personSkillList.size() - 1);
        assertThat(testPersonSkill.getComments()).isEqualTo(DEFAULT_COMMENTS);
        assertThat(testPersonSkill.getLevel()).isEqualTo(DEFAULT_LEVEL);
    }

    @Test
    @Transactional
    void fullUpdatePersonSkillWithPatch() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();

        // Update the personSkill using partial update
        PersonSkill partialUpdatedPersonSkill = new PersonSkill();
        partialUpdatedPersonSkill.setId(personSkill.getId());

        partialUpdatedPersonSkill.comments(UPDATED_COMMENTS).level(UPDATED_LEVEL);

        restPersonSkillMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonSkill.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonSkill))
            )
            .andExpect(status().isOk());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
        PersonSkill testPersonSkill = personSkillList.get(personSkillList.size() - 1);
        assertThat(testPersonSkill.getComments()).isEqualTo(UPDATED_COMMENTS);
        assertThat(testPersonSkill.getLevel()).isEqualTo(UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void patchNonExistingPersonSkill() throws Exception {
        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();
        personSkill.setId(count.incrementAndGet());

        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonSkillMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, personSkillDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPersonSkill() throws Exception {
        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();
        personSkill.setId(count.incrementAndGet());

        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonSkillMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPersonSkill() throws Exception {
        int databaseSizeBeforeUpdate = personSkillRepository.findAll().size();
        personSkill.setId(count.incrementAndGet());

        // Create the PersonSkill
        PersonSkillDTO personSkillDTO = personSkillMapper.toDto(personSkill);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonSkillMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(personSkillDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonSkill in the database
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePersonSkill() throws Exception {
        // Initialize the database
        personSkillRepository.saveAndFlush(personSkill);

        int databaseSizeBeforeDelete = personSkillRepository.findAll().size();

        // Delete the personSkill
        restPersonSkillMockMvc
            .perform(delete(ENTITY_API_URL_ID, personSkill.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PersonSkill> personSkillList = personSkillRepository.findAll();
        assertThat(personSkillList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
