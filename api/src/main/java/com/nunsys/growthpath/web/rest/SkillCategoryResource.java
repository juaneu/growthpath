package com.nunsys.growthpath.web.rest;

import com.nunsys.growthpath.repository.SkillCategoryRepository;
import com.nunsys.growthpath.service.SkillCategoryQueryService;
import com.nunsys.growthpath.service.SkillCategoryService;
import com.nunsys.growthpath.service.criteria.SkillCategoryCriteria;
import com.nunsys.growthpath.service.dto.SkillCategoryDTO;
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
 * REST controller for managing {@link com.nunsys.growthpath.domain.SkillCategory}.
 */
@RestController
@RequestMapping("/api")
public class SkillCategoryResource {

    private final Logger log = LoggerFactory.getLogger(SkillCategoryResource.class);

    private static final String ENTITY_NAME = "skillCategory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SkillCategoryService skillCategoryService;

    private final SkillCategoryRepository skillCategoryRepository;

    private final SkillCategoryQueryService skillCategoryQueryService;

    public SkillCategoryResource(
        SkillCategoryService skillCategoryService,
        SkillCategoryRepository skillCategoryRepository,
        SkillCategoryQueryService skillCategoryQueryService
    ) {
        this.skillCategoryService = skillCategoryService;
        this.skillCategoryRepository = skillCategoryRepository;
        this.skillCategoryQueryService = skillCategoryQueryService;
    }

    /**
     * {@code POST  /skill-categories} : Create a new skillCategory.
     *
     * @param skillCategoryDTO the skillCategoryDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new skillCategoryDTO, or with status {@code 400 (Bad Request)} if the skillCategory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/skill-categories")
    public ResponseEntity<SkillCategoryDTO> createSkillCategory(@Valid @RequestBody SkillCategoryDTO skillCategoryDTO)
        throws URISyntaxException {
        log.debug("REST request to save SkillCategory : {}", skillCategoryDTO);
        if (skillCategoryDTO.getId() != null) {
            throw new BadRequestAlertException("A new skillCategory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SkillCategoryDTO result = skillCategoryService.save(skillCategoryDTO);
        return ResponseEntity
            .created(new URI("/api/skill-categories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /skill-categories/:id} : Updates an existing skillCategory.
     *
     * @param id the id of the skillCategoryDTO to save.
     * @param skillCategoryDTO the skillCategoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated skillCategoryDTO,
     * or with status {@code 400 (Bad Request)} if the skillCategoryDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the skillCategoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/skill-categories/{id}")
    public ResponseEntity<SkillCategoryDTO> updateSkillCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SkillCategoryDTO skillCategoryDTO
    ) throws URISyntaxException {
        log.debug("REST request to update SkillCategory : {}, {}", id, skillCategoryDTO);
        if (skillCategoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, skillCategoryDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!skillCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SkillCategoryDTO result = skillCategoryService.save(skillCategoryDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, skillCategoryDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /skill-categories/:id} : Partial updates given fields of an existing skillCategory, field will ignore if it is null
     *
     * @param id the id of the skillCategoryDTO to save.
     * @param skillCategoryDTO the skillCategoryDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated skillCategoryDTO,
     * or with status {@code 400 (Bad Request)} if the skillCategoryDTO is not valid,
     * or with status {@code 404 (Not Found)} if the skillCategoryDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the skillCategoryDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/skill-categories/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SkillCategoryDTO> partialUpdateSkillCategory(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SkillCategoryDTO skillCategoryDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update SkillCategory partially : {}, {}", id, skillCategoryDTO);
        if (skillCategoryDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, skillCategoryDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!skillCategoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SkillCategoryDTO> result = skillCategoryService.partialUpdate(skillCategoryDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, skillCategoryDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /skill-categories} : get all the skillCategories.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of skillCategories in body.
     */
    @GetMapping("/skill-categories")
    public ResponseEntity<List<SkillCategoryDTO>> getAllSkillCategories(SkillCategoryCriteria criteria, Pageable pageable) {
        log.debug("REST request to get SkillCategories by criteria: {}", criteria);
        Page<SkillCategoryDTO> page = skillCategoryQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /skill-categories/count} : count all the skillCategories.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/skill-categories/count")
    public ResponseEntity<Long> countSkillCategories(SkillCategoryCriteria criteria) {
        log.debug("REST request to count SkillCategories by criteria: {}", criteria);
        return ResponseEntity.ok().body(skillCategoryQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /skill-categories/:id} : get the "id" skillCategory.
     *
     * @param id the id of the skillCategoryDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the skillCategoryDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/skill-categories/{id}")
    public ResponseEntity<SkillCategoryDTO> getSkillCategory(@PathVariable Long id) {
        log.debug("REST request to get SkillCategory : {}", id);
        Optional<SkillCategoryDTO> skillCategoryDTO = skillCategoryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(skillCategoryDTO);
    }

    /**
     * {@code DELETE  /skill-categories/:id} : delete the "id" skillCategory.
     *
     * @param id the id of the skillCategoryDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/skill-categories/{id}")
    public ResponseEntity<Void> deleteSkillCategory(@PathVariable Long id) {
        log.debug("REST request to delete SkillCategory : {}", id);
        skillCategoryService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
