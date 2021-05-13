import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPersonSkill, PersonSkill } from '../person-skill.model';
import { PersonSkillService } from '../service/person-skill.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { ISkill } from 'app/entities/skill/skill.model';
import { SkillService } from 'app/entities/skill/service/skill.service';

@Component({
  selector: 'jhi-person-skill-update',
  templateUrl: './person-skill-update.component.html',
})
export class PersonSkillUpdateComponent implements OnInit {
  isSaving = false;

  peopleSharedCollection: IPerson[] = [];
  skillsSharedCollection: ISkill[] = [];

  editForm = this.fb.group({
    id: [],
    comments: [],
    level: [null, [Validators.required]],
    person: [],
    skill: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected personSkillService: PersonSkillService,
    protected personService: PersonService,
    protected skillService: SkillService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personSkill }) => {
      this.updateForm(personSkill);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('growthpathApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const personSkill = this.createFromForm();
    if (personSkill.id !== undefined) {
      this.subscribeToSaveResponse(this.personSkillService.update(personSkill));
    } else {
      this.subscribeToSaveResponse(this.personSkillService.create(personSkill));
    }
  }

  trackPersonById(index: number, item: IPerson): number {
    return item.id!;
  }

  trackSkillById(index: number, item: ISkill): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonSkill>>): void {
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

  protected updateForm(personSkill: IPersonSkill): void {
    this.editForm.patchValue({
      id: personSkill.id,
      comments: personSkill.comments,
      level: personSkill.level,
      person: personSkill.person,
      skill: personSkill.skill,
    });

    this.peopleSharedCollection = this.personService.addPersonToCollectionIfMissing(this.peopleSharedCollection, personSkill.person);
    this.skillsSharedCollection = this.skillService.addSkillToCollectionIfMissing(this.skillsSharedCollection, personSkill.skill);
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query()
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing(people, this.editForm.get('person')!.value)))
      .subscribe((people: IPerson[]) => (this.peopleSharedCollection = people));

    this.skillService
      .query()
      .pipe(map((res: HttpResponse<ISkill[]>) => res.body ?? []))
      .pipe(map((skills: ISkill[]) => this.skillService.addSkillToCollectionIfMissing(skills, this.editForm.get('skill')!.value)))
      .subscribe((skills: ISkill[]) => (this.skillsSharedCollection = skills));
  }

  protected createFromForm(): IPersonSkill {
    return {
      ...new PersonSkill(),
      id: this.editForm.get(['id'])!.value,
      comments: this.editForm.get(['comments'])!.value,
      level: this.editForm.get(['level'])!.value,
      person: this.editForm.get(['person'])!.value,
      skill: this.editForm.get(['skill'])!.value,
    };
  }
}
