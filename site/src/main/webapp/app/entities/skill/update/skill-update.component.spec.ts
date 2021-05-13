jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SkillService } from '../service/skill.service';
import { ISkill, Skill } from '../skill.model';
import { ISkillCategory } from 'app/entities/skill-category/skill-category.model';
import { SkillCategoryService } from 'app/entities/skill-category/service/skill-category.service';

import { SkillUpdateComponent } from './skill-update.component';

describe('Component Tests', () => {
  describe('Skill Management Update Component', () => {
    let comp: SkillUpdateComponent;
    let fixture: ComponentFixture<SkillUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let skillService: SkillService;
    let skillCategoryService: SkillCategoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SkillUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SkillUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SkillUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      skillService = TestBed.inject(SkillService);
      skillCategoryService = TestBed.inject(SkillCategoryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call SkillCategory query and add missing value', () => {
        const skill: ISkill = { id: 456 };
        const skillCategory: ISkillCategory = { id: 91572 };
        skill.skillCategory = skillCategory;

        const skillCategoryCollection: ISkillCategory[] = [{ id: 63530 }];
        spyOn(skillCategoryService, 'query').and.returnValue(of(new HttpResponse({ body: skillCategoryCollection })));
        const additionalSkillCategories = [skillCategory];
        const expectedCollection: ISkillCategory[] = [...additionalSkillCategories, ...skillCategoryCollection];
        spyOn(skillCategoryService, 'addSkillCategoryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ skill });
        comp.ngOnInit();

        expect(skillCategoryService.query).toHaveBeenCalled();
        expect(skillCategoryService.addSkillCategoryToCollectionIfMissing).toHaveBeenCalledWith(
          skillCategoryCollection,
          ...additionalSkillCategories
        );
        expect(comp.skillCategoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const skill: ISkill = { id: 456 };
        const skillCategory: ISkillCategory = { id: 25471 };
        skill.skillCategory = skillCategory;

        activatedRoute.data = of({ skill });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(skill));
        expect(comp.skillCategoriesSharedCollection).toContain(skillCategory);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const skill = { id: 123 };
        spyOn(skillService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ skill });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: skill }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(skillService.update).toHaveBeenCalledWith(skill);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const skill = new Skill();
        spyOn(skillService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ skill });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: skill }));
        saveSubject.complete();

        // THEN
        expect(skillService.create).toHaveBeenCalledWith(skill);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const skill = { id: 123 };
        spyOn(skillService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ skill });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(skillService.update).toHaveBeenCalledWith(skill);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSkillCategoryById', () => {
        it('Should return tracked SkillCategory primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSkillCategoryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
