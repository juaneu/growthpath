import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISkill } from '../skill.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SkillService } from '../service/skill.service';
import { SkillDeleteDialogComponent } from '../delete/skill-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { ISkillCategory } from '../../skill-category/skill-category.model';
import { ActivatedRoute } from '@angular/router';
import { SkillCategoryService } from '../../skill-category/service/skill-category.service';
import { finalize, map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'jhi-skill',
  templateUrl: './skill.component.html',
})
export class SkillComponent implements OnInit {
  skills: ISkill[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    editSkillCategory: [],
  });

  skillCategory?: ISkillCategory;
  isSaving = false;
  skillCategorySharedCollection: ISkillCategory[] = [];
  statuses: ISkillCategory[] = [];

  skillNew: ISkill = {};

  constructor(
    protected fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected skillService: SkillService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected skillCategoryService: SkillCategoryService
  ) {
    this.skills = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'name';
    this.ascending = true;
  }

  onRowEditInit(skill: ISkill): void {
    this.skillService.find(skill.id!);
  }

  onRowEditSave(skill: ISkill): void {
    this.save(skill);
  }

  onRowEditCancel(skill: ISkill, index: number): void {
    // Load previous information
  }

  onRowDelete(skill: ISkill): void {
    const modalRef = this.modalService.open(SkillDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.skill = skill;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  save(skill: ISkill): void {
    this.isSaving = true;
    if (skill.id !== undefined) {
      this.subscribeToSaveResponse(this.skillService.update(skill));
    } else {
      this.skillService.create(skill).subscribe(() => this.reset());
    }
    this.skillNew = {};
  }

  loadAll(): void {
    this.isLoading = true;

    const filters: Map<string, any> = new Map();

    if (this.activatedRoute.snapshot.params.id) {
      filters.set('skillCategoryId.equals', this.skillCategory!.id);
    }

    this.skillService
      .query({
        filter: filters,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ISkill[]>) => {
          this.isLoading = false;
          this.paginateSkills(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.skills = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ skillCategory }) => {
      this.skillCategory = skillCategory;
      this.loadAll();
      this.loadRelationshipsOptions();
    });
  }

  trackId(index: number, item: ISkill): number {
    return item.id!;
  }

  trackSkillCategoryById(index: number, item: ISkillCategory): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISkill>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(() => this.onSaveError());
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateSkills(data: ISkill[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      this.skills.push(this.skillNew);
      for (const d of data) {
        this.skills.push(d);
      }
    }
  }

  protected loadRelationshipsOptions(): void {
    this.skillCategoryService
      .query()
      .pipe(map((res: HttpResponse<ISkillCategory[]>) => res.body ?? []))
      .pipe(
        map((skillsC: ISkillCategory[]) =>
          this.skillCategoryService.addSkillCategoryToCollectionIfMissing(skillsC, this.editForm.get('editSkillCategory')!.value)
        )
      )
      .subscribe((skillsC: ISkillCategory[]) => (this.skillCategorySharedCollection = skillsC));

    this.statuses = this.skillCategorySharedCollection;
  }
}
