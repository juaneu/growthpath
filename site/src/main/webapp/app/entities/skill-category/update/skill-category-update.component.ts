import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISkillCategory, SkillCategory } from '../skill-category.model';
import { SkillCategoryService } from '../service/skill-category.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';

@Component({
  selector: 'jhi-skill-category-update',
  templateUrl: './skill-category-update.component.html',
})
export class SkillCategoryUpdateComponent implements OnInit {
  isSaving = false;

  unitsSharedCollection: IUnit[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    unit: [],
  });

  constructor(
    protected skillCategoryService: SkillCategoryService,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ skillCategory }) => {
      this.updateForm(skillCategory);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const skillCategory = this.createFromForm();
    if (skillCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.skillCategoryService.update(skillCategory));
    } else {
      this.subscribeToSaveResponse(this.skillCategoryService.create(skillCategory));
    }
  }

  trackUnitById(index: number, item: IUnit): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISkillCategory>>): void {
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

  protected updateForm(skillCategory: ISkillCategory): void {
    this.editForm.patchValue({
      id: skillCategory.id,
      name: skillCategory.name,
      unit: skillCategory.unit,
    });

    this.unitsSharedCollection = this.unitService.addUnitToCollectionIfMissing(this.unitsSharedCollection, skillCategory.unit);
  }

  protected loadRelationshipsOptions(): void {
    this.unitService
      .query()
      .pipe(map((res: HttpResponse<IUnit[]>) => res.body ?? []))
      .pipe(map((units: IUnit[]) => this.unitService.addUnitToCollectionIfMissing(units, this.editForm.get('unit')!.value)))
      .subscribe((units: IUnit[]) => (this.unitsSharedCollection = units));
  }

  protected createFromForm(): ISkillCategory {
    return {
      ...new SkillCategory(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      unit: this.editForm.get(['unit'])!.value,
    };
  }
}
