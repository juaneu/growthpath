jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SkillCategoryService } from '../service/skill-category.service';
import { ISkillCategory, SkillCategory } from '../skill-category.model';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';

import { SkillCategoryUpdateComponent } from './skill-category-update.component';

describe('Component Tests', () => {
  describe('SkillCategory Management Update Component', () => {
    let comp: SkillCategoryUpdateComponent;
    let fixture: ComponentFixture<SkillCategoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let skillCategoryService: SkillCategoryService;
    let unitService: UnitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SkillCategoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SkillCategoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SkillCategoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      skillCategoryService = TestBed.inject(SkillCategoryService);
      unitService = TestBed.inject(UnitService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Unit query and add missing value', () => {
        const skillCategory: ISkillCategory = { id: 456 };
        const unit: IUnit = { id: 79516 };
        skillCategory.unit = unit;

        const unitCollection: IUnit[] = [{ id: 31000 }];
        spyOn(unitService, 'query').and.returnValue(of(new HttpResponse({ body: unitCollection })));
        const additionalUnits = [unit];
        const expectedCollection: IUnit[] = [...additionalUnits, ...unitCollection];
        spyOn(unitService, 'addUnitToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ skillCategory });
        comp.ngOnInit();

        expect(unitService.query).toHaveBeenCalled();
        expect(unitService.addUnitToCollectionIfMissing).toHaveBeenCalledWith(unitCollection, ...additionalUnits);
        expect(comp.unitsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const skillCategory: ISkillCategory = { id: 456 };
        const unit: IUnit = { id: 19466 };
        skillCategory.unit = unit;

        activatedRoute.data = of({ skillCategory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(skillCategory));
        expect(comp.unitsSharedCollection).toContain(unit);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const skillCategory = { id: 123 };
        spyOn(skillCategoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ skillCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: skillCategory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(skillCategoryService.update).toHaveBeenCalledWith(skillCategory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const skillCategory = new SkillCategory();
        spyOn(skillCategoryService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ skillCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: skillCategory }));
        saveSubject.complete();

        // THEN
        expect(skillCategoryService.create).toHaveBeenCalledWith(skillCategory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const skillCategory = { id: 123 };
        spyOn(skillCategoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ skillCategory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(skillCategoryService.update).toHaveBeenCalledWith(skillCategory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUnitById', () => {
        it('Should return tracked Unit primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUnitById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
