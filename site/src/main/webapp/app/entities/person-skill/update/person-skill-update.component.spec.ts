jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PersonSkillService } from '../service/person-skill.service';
import { IPersonSkill, PersonSkill } from '../person-skill.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ISkill } from 'app/entities/skill/skill.model';
import { SkillService } from 'app/entities/skill/service/skill.service';

import { PersonSkillUpdateComponent } from './person-skill-update.component';

describe('Component Tests', () => {
  describe('PersonSkill Management Update Component', () => {
    let comp: PersonSkillUpdateComponent;
    let fixture: ComponentFixture<PersonSkillUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let personSkillService: PersonSkillService;
    let personService: PersonService;
    let skillService: SkillService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PersonSkillUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PersonSkillUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PersonSkillUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      personSkillService = TestBed.inject(PersonSkillService);
      personService = TestBed.inject(PersonService);
      skillService = TestBed.inject(SkillService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Person query and add missing value', () => {
        const personSkill: IPersonSkill = { id: 456 };
        const person: IPerson = { id: 15999 };
        personSkill.person = person;

        const personCollection: IPerson[] = [{ id: 47420 }];
        spyOn(personService, 'query').and.returnValue(of(new HttpResponse({ body: personCollection })));
        const additionalPeople = [person];
        const expectedCollection: IPerson[] = [...additionalPeople, ...personCollection];
        spyOn(personService, 'addPersonToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ personSkill });
        comp.ngOnInit();

        expect(personService.query).toHaveBeenCalled();
        expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(personCollection, ...additionalPeople);
        expect(comp.peopleSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Skill query and add missing value', () => {
        const personSkill: IPersonSkill = { id: 456 };
        const skill: ISkill = { id: 63088 };
        personSkill.skill = skill;

        const skillCollection: ISkill[] = [{ id: 3969 }];
        spyOn(skillService, 'query').and.returnValue(of(new HttpResponse({ body: skillCollection })));
        const additionalSkills = [skill];
        const expectedCollection: ISkill[] = [...additionalSkills, ...skillCollection];
        spyOn(skillService, 'addSkillToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ personSkill });
        comp.ngOnInit();

        expect(skillService.query).toHaveBeenCalled();
        expect(skillService.addSkillToCollectionIfMissing).toHaveBeenCalledWith(skillCollection, ...additionalSkills);
        expect(comp.skillsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const personSkill: IPersonSkill = { id: 456 };
        const person: IPerson = { id: 86007 };
        personSkill.person = person;
        const skill: ISkill = { id: 31424 };
        personSkill.skill = skill;

        activatedRoute.data = of({ personSkill });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(personSkill));
        expect(comp.peopleSharedCollection).toContain(person);
        expect(comp.skillsSharedCollection).toContain(skill);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const personSkill = { id: 123 };
        spyOn(personSkillService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ personSkill });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: personSkill }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(personSkillService.update).toHaveBeenCalledWith(personSkill);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const personSkill = new PersonSkill();
        spyOn(personSkillService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ personSkill });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: personSkill }));
        saveSubject.complete();

        // THEN
        expect(personSkillService.create).toHaveBeenCalledWith(personSkill);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const personSkill = { id: 123 };
        spyOn(personSkillService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ personSkill });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(personSkillService.update).toHaveBeenCalledWith(personSkill);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackPersonById', () => {
        it('Should return tracked Person primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPersonById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSkillById', () => {
        it('Should return tracked Skill primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSkillById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
