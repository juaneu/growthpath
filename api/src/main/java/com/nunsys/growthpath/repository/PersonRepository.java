package com.nunsys.growthpath.repository;

import com.nunsys.growthpath.domain.Person;
import com.nunsys.growthpath.service.dto.PersonAvatarDTO;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Person entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PersonRepository extends JpaRepository<Person, Long>, JpaSpecificationExecutor<Person> {

    @Query(value = "SELECT new com.nunsys.growthpath.service.dto.PersonAvatarDTO(acronym, image) from Person p where p.id = :id ")

    public PersonAvatarDTO findAvatar(@Param("id") Long id);

}
