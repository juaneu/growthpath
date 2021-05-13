package com.nunsys.growthpath.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A SkillCategory.
 */
@Entity
@Table(name = "skill_category")
public class SkillCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @OneToMany(mappedBy = "skillCategory")
    @JsonIgnoreProperties(value = { "skillCategory" }, allowSetters = true)
    private Set<Skill> skills = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "responsable", "organization" }, allowSetters = true)
    private Unit unit;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SkillCategory id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public SkillCategory name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Skill> getSkills() {
        return this.skills;
    }

    public SkillCategory skills(Set<Skill> skills) {
        this.setSkills(skills);
        return this;
    }

    public SkillCategory addSkills(Skill skill) {
        this.skills.add(skill);
        skill.setSkillCategory(this);
        return this;
    }

    public SkillCategory removeSkills(Skill skill) {
        this.skills.remove(skill);
        skill.setSkillCategory(null);
        return this;
    }

    public void setSkills(Set<Skill> skills) {
        if (this.skills != null) {
            this.skills.forEach(i -> i.setSkillCategory(null));
        }
        if (skills != null) {
            skills.forEach(i -> i.setSkillCategory(this));
        }
        this.skills = skills;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public SkillCategory unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SkillCategory)) {
            return false;
        }
        return id != null && id.equals(((SkillCategory) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SkillCategory{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
