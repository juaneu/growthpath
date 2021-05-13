package com.nunsys.growthpath.service.criteria;

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
 * Criteria class for the {@link com.nunsys.growthpath.domain.Unit} entity. This class is used
 * in {@link com.nunsys.growthpath.web.rest.UnitResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /units?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class UnitCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private StringFilter acronym;

    private StringFilter color;

    private LongFilter responsableId;

    private LongFilter organizationId;

    public UnitCriteria() {}

    public UnitCriteria(UnitCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.acronym = other.acronym == null ? null : other.acronym.copy();
        this.color = other.color == null ? null : other.color.copy();
        this.responsableId = other.responsableId == null ? null : other.responsableId.copy();
        this.organizationId = other.organizationId == null ? null : other.organizationId.copy();
    }

    @Override
    public UnitCriteria copy() {
        return new UnitCriteria(this);
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

    public StringFilter getName() {
        return name;
    }

    public StringFilter name() {
        if (name == null) {
            name = new StringFilter();
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public StringFilter getAcronym() {
        return acronym;
    }

    public StringFilter acronym() {
        if (acronym == null) {
            acronym = new StringFilter();
        }
        return acronym;
    }

    public void setAcronym(StringFilter acronym) {
        this.acronym = acronym;
    }

    public StringFilter getColor() {
        return color;
    }

    public StringFilter color() {
        if (color == null) {
            color = new StringFilter();
        }
        return color;
    }

    public void setColor(StringFilter color) {
        this.color = color;
    }

    public LongFilter getResponsableId() {
        return responsableId;
    }

    public LongFilter responsableId() {
        if (responsableId == null) {
            responsableId = new LongFilter();
        }
        return responsableId;
    }

    public void setResponsableId(LongFilter responsableId) {
        this.responsableId = responsableId;
    }

    public LongFilter getOrganizationId() {
        return organizationId;
    }

    public LongFilter organizationId() {
        if (organizationId == null) {
            organizationId = new LongFilter();
        }
        return organizationId;
    }

    public void setOrganizationId(LongFilter organizationId) {
        this.organizationId = organizationId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final UnitCriteria that = (UnitCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(acronym, that.acronym) &&
            Objects.equals(color, that.color) &&
            Objects.equals(responsableId, that.responsableId) &&
            Objects.equals(organizationId, that.organizationId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, acronym, color, responsableId, organizationId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UnitCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (acronym != null ? "acronym=" + acronym + ", " : "") +
            (color != null ? "color=" + color + ", " : "") +
            (responsableId != null ? "responsableId=" + responsableId + ", " : "") +
            (organizationId != null ? "organizationId=" + organizationId + ", " : "") +
            "}";
    }
}
