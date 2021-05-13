package com.nunsys.growthpath.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LocalDateFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.nunsys.growthpath.domain.Person} entity. This class is used
 * in {@link com.nunsys.growthpath.web.rest.PersonResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /people?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class PersonCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private StringFilter jobDescription;

    private StringFilter email;

    private StringFilter acronym;

    private LocalDateFilter birthDate;

    private LongFilter userId;

    private LongFilter areaId;

    public PersonCriteria() {}

    public PersonCriteria(PersonCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.jobDescription = other.jobDescription == null ? null : other.jobDescription.copy();
        this.email = other.email == null ? null : other.email.copy();
        this.acronym = other.acronym == null ? null : other.acronym.copy();
        this.birthDate = other.birthDate == null ? null : other.birthDate.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.areaId = other.areaId == null ? null : other.areaId.copy();
    }

    @Override
    public PersonCriteria copy() {
        return new PersonCriteria(this);
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

    public StringFilter getJobDescription() {
        return jobDescription;
    }

    public StringFilter jobDescription() {
        if (jobDescription == null) {
            jobDescription = new StringFilter();
        }
        return jobDescription;
    }

    public void setJobDescription(StringFilter jobDescription) {
        this.jobDescription = jobDescription;
    }

    public StringFilter getEmail() {
        return email;
    }

    public StringFilter email() {
        if (email == null) {
            email = new StringFilter();
        }
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
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

    public LocalDateFilter getBirthDate() {
        return birthDate;
    }

    public LocalDateFilter birthDate() {
        if (birthDate == null) {
            birthDate = new LocalDateFilter();
        }
        return birthDate;
    }

    public void setBirthDate(LocalDateFilter birthDate) {
        this.birthDate = birthDate;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public LongFilter userId() {
        if (userId == null) {
            userId = new LongFilter();
        }
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getAreaId() {
        return areaId;
    }

    public LongFilter areaId() {
        if (areaId == null) {
            areaId = new LongFilter();
        }
        return areaId;
    }

    public void setAreaId(LongFilter areaId) {
        this.areaId = areaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PersonCriteria that = (PersonCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(jobDescription, that.jobDescription) &&
            Objects.equals(email, that.email) &&
            Objects.equals(acronym, that.acronym) &&
            Objects.equals(birthDate, that.birthDate) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(areaId, that.areaId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, jobDescription, email, acronym, birthDate, userId, areaId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PersonCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (jobDescription != null ? "jobDescription=" + jobDescription + ", " : "") +
            (email != null ? "email=" + email + ", " : "") +
            (acronym != null ? "acronym=" + acronym + ", " : "") +
            (birthDate != null ? "birthDate=" + birthDate + ", " : "") +
            (userId != null ? "userId=" + userId + ", " : "") +
            (areaId != null ? "areaId=" + areaId + ", " : "") +
            "}";
    }
}
