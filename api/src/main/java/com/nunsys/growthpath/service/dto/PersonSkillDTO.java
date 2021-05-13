package com.nunsys.growthpath.service.dto;

import com.nunsys.growthpath.domain.enumeration.SkillLevel;
import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.nunsys.growthpath.domain.PersonSkill} entity.
 */
public class PersonSkillDTO implements Serializable {

    private Long id;

    @Lob
    private String comments;

    @NotNull
    private SkillLevel level;

    private PersonDTO person;

    private SkillDTO skill;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public SkillLevel getLevel() {
        return level;
    }

    public void setLevel(SkillLevel level) {
        this.level = level;
    }

    public PersonDTO getPerson() {
        return person;
    }

    public void setPerson(PersonDTO person) {
        this.person = person;
    }

    public SkillDTO getSkill() {
        return skill;
    }

    public void setSkill(SkillDTO skill) {
        this.skill = skill;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PersonSkillDTO)) {
            return false;
        }

        PersonSkillDTO personSkillDTO = (PersonSkillDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, personSkillDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PersonSkillDTO{" +
            "id=" + getId() +
            ", comments='" + getComments() + "'" +
            ", level='" + getLevel() + "'" +
            ", person=" + getPerson() +
            ", skill=" + getSkill() +
            "}";
    }
}
