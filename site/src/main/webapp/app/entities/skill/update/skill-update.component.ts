import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISkill, Skill } from '../skill.model';
import { SkillService } from '../service/skill.service';
import { ISkillCategory } from 'app/entities/skill-category/skill-category.model';
import { SkillCategoryService } from 'app/entities/skill-category/service/skill-category.service';

@Component({
  selector: 'jhi-skill-update',
  templateUrl: './skill-update.component.html',
})
export class SkillUpdateComponent implements OnInit {
  isSaving = false;

  skillCategoriesSharedCollection: ISkillCategory[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    skillCategory: [],
  });

  constructor(
    protected skillService: SkillService,
    protected skillCategoryService: SkillCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ skill }) => {
      this.updateForm(skill);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const skill = this.createFromForm();
    if (skill.id !== undefined) {
      this.subscribeToSaveResponse(this.skillService.update(skill));
    } else {
      this.subscribeToSaveResponse(this.skillService.create(skill));
    }
  }

  trackSkillCategoryById(index: number, item: ISkillCategory): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISkill>>): void {
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

  protected updateForm(skill: ISkill): void {
    this.editForm.patchValue({
      id: skill.id,
      name: skill.name,
      skillCategory: skill.skillCategory,
    });

    this.skillCategoriesSharedCollection = this.skillCategoryService.addSkillCategoryToCollectionIfMissing(
      this.skillCategoriesSharedCollection,
      skill.skillCategory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.skillCategoryService
      .query()
      .pipe(map((res: HttpResponse<ISkillCategory[]>) => res.body ?? []))
      .pipe(
        map((skillCategories: ISkillCategory[]) =>
          this.skillCategoryService.addSkillCategoryToCollectionIfMissing(skillCategories, this.editForm.get('skillCategory')!.value)
        )
      )
      .subscribe((skillCategories: ISkillCategory[]) => (this.skillCategoriesSharedCollection = skillCategories));
  }

  protected createFromForm(): ISkill {
    return {
      ...new Skill(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      skillCategory: this.editForm.get(['skillCategory'])!.value,
    };
  }
}
