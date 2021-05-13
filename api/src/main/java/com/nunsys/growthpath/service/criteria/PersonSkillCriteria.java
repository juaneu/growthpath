package com.nunsys.growthpath.service.criteria;

import com.nunsys.growthpath.domain.enumeration.SkillLevel;
import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.nunsys.growthpath.domain.PersonSkill} entity. This class is used
 * in {@link com.nunsys.growthpath.web.rest.PersonSkillResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /person-skills?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class PersonSkillCriteria implements Serializable, Criteria {

    /**
     * Class for filtering SkillLevel
     */
    public static class SkillLevelFilter extends Filter<SkillLevel> {

        public SkillLevelFilter() {}

        public SkillLevelFilter(SkillLevelFilter filter) {
            super(filter);
        }

        @Override
        public SkillLevelFilter copy() {
            return new SkillLevelFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private SkillLevelFilter level;

    private LongFilter personId;

    private LongFilter skillId;

    public PersonSkillCriteria() {}

    public PersonSkillCriteria(PersonSkillCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.level = other.level == null ? null : other.level.copy();
        this.personId = other.personId == null ? null : other.personId.copy();
        this.skillId = other.skillId == null ? null : other.skillId.copy();
    }

    @Override
    public PersonSkillCriteria copy() {
        return new PersonSkillCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public SkillLevelFilter getLevel() {
        return level;
    }

    public SkillLevelFilter level() {
        if (level == null) {
            level = new SkillLevelFilter();
        }
        return level;
    }

    public void setLevel(SkillLevelFilter level) {
        this.level = level;
    }

    public LongFilter getPersonId() {
        return personId;
    }

    public LongFilter personId() {
        if (personId == null) {
            personId = new LongFilter();
        }
        return personId;
    }

    public void setPersonId(LongFilter personId) {
        this.personId = personId;
    }

    public LongFilter getSkillId() {
        return skillId;
    }

    public LongFilter skillId() {
        if (skillId == null) {
            skillId = new LongFilter();
        }
        return skillId;
    }

    public void setSkillId(LongFilter skillId) {
        this.skillId = skillId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PersonSkillCriteria that = (PersonSkillCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(level, that.level) &&
            Objects.equals(personId, that.personId) &&
            Objects.equals(skillId, that.skillId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, level, personId, skillId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PersonSkillCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (level != null ? "level=" + level + ", " : "") +
            (personId != null ? "personId=" + personId + ", " : "") +
            (skillId != null ? "skillId=" + skillId + ", " : "") +
            "}";
    }
}
