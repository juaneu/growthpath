package com.nunsys.growthpath.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.nunsys.growthpath.domain.enumeration.SkillLevel;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Type;

/**
 * A PersonSkill.
 */
@Entity
@Table(name = "person_skill")
public class PersonSkill implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "comments")
    private String comments;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private SkillLevel level;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "area" }, allowSetters = true)
    private Person person;

    @ManyToOne
    @JsonIgnoreProperties(value = { "skillCategory" }, allowSetters = true)
    private Skill skill;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PersonSkill id(Long id) {
        this.id = id;
        return this;
    }

    public String getComments() {
        return this.comments;
    }

    public PersonSkill comments(String comments) {
        this.comments = comments;
        return this;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public SkillLevel getLevel() {
        return this.level;
    }

    public PersonSkill level(SkillLevel level) {
        this.level = level;
        return this;
    }

    public void setLevel(SkillLevel level) {
        this.level = level;
    }

    public Person getPerson() {
        return this.person;
    }

    public PersonSkill person(Person person) {
        this.setPerson(person);
        return this;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Skill getSkill() {
        return this.skill;
    }

    public PersonSkill skill(Skill skill) {
        this.setSkill(skill);
        return this;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PersonSkill)) {
            return false;
        }
        return id != null && id.equals(((PersonSkill) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PersonSkill{" +
            "id=" + getId() +
            ", comments='" + getComments() + "'" +
            ", level='" + getLevel() + "'" +
            "}";
    }
}
