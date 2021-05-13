package com.nunsys.growthpath.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.nunsys.growthpath.domain.SkillCategory} entity.
 */
public class SkillCategoryDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String name;

    private UnitDTO unit;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UnitDTO getUnit() {
        return unit;
    }

    public void setUnit(UnitDTO unit) {
        this.unit = unit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SkillCategoryDTO)) {
            return false;
        }

        SkillCategoryDTO skillCategoryDTO = (SkillCategoryDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, skillCategoryDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SkillCategoryDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", unit=" + getUnit() +
            "}";
    }
}
