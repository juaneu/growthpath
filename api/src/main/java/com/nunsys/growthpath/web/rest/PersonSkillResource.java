package com.nunsys.growthpath.web.rest;

import com.nunsys.growthpath.repository.PersonSkillRepository;
import com.nunsys.growthpath.service.PersonSkillQueryService;
import com.nunsys.growthpath.service.PersonSkillService;
import com.nunsys.growthpath.service.criteria.PersonSkillCriteria;
import com.nunsys.growthpath.service.dto.PersonSkillDTO;
import com.nunsys.growthpath.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.nunsys.growthpath.domain.PersonSkill}.
 */
@RestController
@RequestMapping("/api")
public class PersonSkillResource {

    private final Logger log = LoggerFactory.getLogger(PersonSkillResource.class);

    private static final String ENTITY_NAME = "personSkill";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonSkillService personSkillService;

    private final PersonSkillRepository personSkillRepository;

    private final PersonSkillQueryService personSkillQueryService;

    public PersonSkillResource(
        PersonSkillService personSkillService,
        PersonSkillRepository personSkillRepository,
        PersonSkillQueryService personSkillQueryService
    ) {
        this.personSkillService = personSkillService;
        this.personSkillRepository = personSkillRepository;
        this.personSkillQueryService = personSkillQueryService;
    }

    /**
     * {@code POST  /person-skills} : Create a new personSkill.
     *
     * @param personSkillDTO the personSkillDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new personSkillDTO, or with status {@code 400 (Bad Request)} if the personSkill has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/person-skills")
    public ResponseEntity<PersonSkillDTO> createPersonSkill(@Valid @RequestBody PersonSkillDTO personSkillDTO) throws URISyntaxException {
        log.debug("REST request to save PersonSkill : {}", personSkillDTO);
        if (personSkillDTO.getId() != null) {
            throw new BadRequestAlertException("A new personSkill cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PersonSkillDTO result = personSkillService.save(personSkillDTO);
        return ResponseEntity
            .created(new URI("/api/person-skills/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /person-skills/:id} : Updates an existing personSkill.
     *
     * @param id the id of the personSkillDTO to save.
     * @param personSkillDTO the personSkillDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personSkillDTO,
     * or with status {@code 400 (Bad Request)} if the personSkillDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the personSkillDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/person-skills/{id}")
    public ResponseEntity<PersonSkillDTO> updatePersonSkill(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PersonSkillDTO personSkillDTO
    ) throws URISyntaxException {
        log.debug("REST request to update PersonSkill : {}, {}", id, personSkillDTO);
        if (personSkillDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personSkillDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personSkillRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PersonSkillDTO result = personSkillService.save(personSkillDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personSkillDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /person-skills/:id} : Partial updates given fields of an existing personSkill, field will ignore if it is null
     *
     * @param id the id of the personSkillDTO to save.
     * @param personSkillDTO the personSkillDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personSkillDTO,
     * or with status {@code 400 (Bad Request)} if the personSkillDTO is not valid,
     * or with status {@code 404 (Not Found)} if the personSkillDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the personSkillDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/person-skills/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<PersonSkillDTO> partialUpdatePersonSkill(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PersonSkillDTO personSkillDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update PersonSkill partially : {}, {}", id, personSkillDTO);
        if (personSkillDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personSkillDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personSkillRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PersonSkillDTO> result = personSkillService.partialUpdate(personSkillDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personSkillDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /person-skills} : get all the personSkills.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personSkills in body.
     */
    @GetMapping("/person-skills")
    public ResponseEntity<List<PersonSkillDTO>> getAllPersonSkills(PersonSkillCriteria criteria, Pageable pageable) {
        log.debug("REST request to get PersonSkills by criteria: {}", criteria);
        Page<PersonSkillDTO> page = personSkillQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /person-skills/count} : count all the personSkills.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/person-skills/count")
    public ResponseEntity<Long> countPersonSkills(PersonSkillCriteria criteria) {
        log.debug("REST request to count PersonSkills by criteria: {}", criteria);
        return ResponseEntity.ok().body(personSkillQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /person-skills/:id} : get the "id" personSkill.
     *
     * @param id the id of the personSkillDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the personSkillDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/person-skills/{id}")
    public ResponseEntity<PersonSkillDTO> getPersonSkill(@PathVariable Long id) {
        log.debug("REST request to get PersonSkill : {}", id);
        Optional<PersonSkillDTO> personSkillDTO = personSkillService.findOne(id);
        return ResponseUtil.wrapOrNotFound(personSkillDTO);
    }

    /**
     * {@code DELETE  /person-skills/:id} : delete the "id" personSkill.
     *
     * @param id the id of the personSkillDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/person-skills/{id}")
    public ResponseEntity<Void> deletePersonSkill(@PathVariable Long id) {
        log.debug("REST request to delete PersonSkill : {}", id);
        personSkillService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
