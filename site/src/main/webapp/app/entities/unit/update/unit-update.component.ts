import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUnit, Unit } from '../unit.model';
import { UnitService } from '../service/unit.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

@Component({
  selector: 'jhi-unit-update',
  templateUrl: './unit-update.component.html',
})
export class UnitUpdateComponent implements OnInit {
  isSaving = false;

  responsablesCollection: IPerson[] = [];
  organizationsSharedCollection: IOrganization[] = [];
  searchResponsable?: IPerson;

  color = '';

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    acronym: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    color: [null, [Validators.required]],
    responsable: [],
    organization: [],
  });

  constructor(
    protected unitService: UnitService,
    protected personService: PersonService,
    protected organizationService: OrganizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ unit }) => {
      this.updateForm(unit);
      this.color = this.editForm.get(['color'])!.value;
      this.loadRelationshipsOptions();
    });
  }

  updateColor(): void {
    this.color = this.editForm.get(['color'])!.value;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const unit = this.createFromForm();
    unit.responsable = this.searchResponsable;
    if (unit.id !== undefined) {
      this.subscribeToSaveResponse(this.unitService.update(unit));
    } else {
      this.subscribeToSaveResponse(this.unitService.create(unit));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackOrganizationById(index: number, item: IOrganization): number {
    return item.id!;
  }

  loadRelationshipsOptions(): void {
    const filters: Map<string, any> = new Map();
    filters.set('name.contains', this.searchResponsable);
    this.personService
      .query({
        'unitId.specified': 'false',
        sort: ['name,asc'],
        filter: filters,
      })
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('responsable')!.value)))
      .subscribe((people: IPerson[]) => (this.responsablesCollection = people));

    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnit>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(unit: IUnit): void {
    this.editForm.patchValue({
      id: unit.id,
      name: unit.name,
      acronym: unit.acronym,
      color: unit.color,
      responsable: unit.responsable,
      organization: unit.organization,
    });

    this.responsablesCollection = this.personService.addPersonToCollectionIfMissing(this.responsablesCollection, unit.responsable);
    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      unit.organization
    );
  }

  protected createFromForm(): IUnit {
    return {
      ...new Unit(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      acronym: this.editForm.get(['acronym'])!.value,
      color: this.editForm.get(['color'])!.value,
      responsable: this.editForm.get(['responsable'])!.value,
      organization: this.editForm.get(['organization'])!.value,
    };
  }
}
