jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UnitService } from '../service/unit.service';
import { IUnit, Unit } from '../unit.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { UnitUpdateComponent } from './unit-update.component';

describe('Component Tests', () => {
  describe('Unit Management Update Component', () => {
    let comp: UnitUpdateComponent;
    let fixture: ComponentFixture<UnitUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let unitService: UnitService;
    let personService: PersonService;
    let organizationService: OrganizationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UnitUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UnitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UnitUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      unitService = TestBed.inject(UnitService);
      personService = TestBed.inject(PersonService);
      organizationService = TestBed.inject(OrganizationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call responsable query and add missing value', () => {
        const unit: IUnit = { id: 456 };
        const responsable: IPerson = { id: 38932 };
        unit.responsable = responsable;

        const responsableCollection: IPerson[] = [{ id: 48070 }];
        spyOn(personService, 'query').and.returnValue(of(new HttpResponse({ body: responsableCollection })));
        const expectedCollection: IPerson[] = [responsable, ...responsableCollection];
        spyOn(personService, 'addPersonToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ unit });
        comp.ngOnInit();

        expect(personService.query).toHaveBeenCalled();
        expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(responsableCollection, responsable);
        expect(comp.responsablesCollection).toEqual(expectedCollection);
      });

      it('Should call Organization query and add missing value', () => {
        const unit: IUnit = { id: 456 };
        const organization: IOrganization = { id: 38762 };
        unit.organization = organization;

        const organizationCollection: IOrganization[] = [{ id: 33052 }];
        spyOn(organizationService, 'query').and.returnValue(of(new HttpResponse({ body: organizationCollection })));
        const additionalOrganizations = [organization];
        const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
        spyOn(organizationService, 'addOrganizationToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ unit });
        comp.ngOnInit();

        expect(organizationService.query).toHaveBeenCalled();
        expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
          organizationCollection,
          ...additionalOrganizations
        );
        expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const unit: IUnit = { id: 456 };
        const responsable: IPerson = { id: 42031 };
        unit.responsable = responsable;
        const organization: IOrganization = { id: 32464 };
        unit.organization = organization;

        activatedRoute.data = of({ unit });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(unit));
        expect(comp.responsablesCollection).toContain(responsable);
        expect(comp.organizationsSharedCollection).toContain(organization);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const unit = { id: 123 };
        spyOn(unitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ unit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: unit }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(unitService.update).toHaveBeenCalledWith(unit);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const unit = new Unit();
        spyOn(unitService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ unit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: unit }));
        saveSubject.complete();

        // THEN
        expect(unitService.create).toHaveBeenCalledWith(unit);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const unit = { id: 123 };
        spyOn(unitService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ unit });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(unitService.update).toHaveBeenCalledWith(unit);
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

      describe('trackOrganizationById', () => {
        it('Should return tracked Organization primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackOrganizationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
