package com.nunsys.growthpath.service.dto;

import javax.persistence.Lob;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

public class PersonAvatarDTO {


    @NotNull
    @Size(min = 2, max = 3)
    private String acronym;


    @Lob
    private byte[] image;

    public PersonAvatarDTO() {

    }

    public PersonAvatarDTO(String acronym, @NotNull byte[] image) {
        this.acronym = acronym;
        this.image = image;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
