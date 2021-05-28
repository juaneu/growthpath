import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISkill } from '../skill.model';
import { ISkillCategory } from '../../skill-category/skill-category.model';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SkillService } from '../service/skill.service';
import { SkillDeleteDialogComponent } from '../delete/skill-delete-dialog.component';
import { SkillCategoryService } from '../../skill-category/service/skill-category.service';
import { FormBuilder } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'jhi-skill',
  templateUrl: './skill.component.html',
})
export class SkillComponent implements OnInit {
  skills: ISkill[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  editForm = this.fb.group({
    id: [],
    name: [],
    editSkillCategory: [],
  });

  skillCategory?: ISkillCategory;
  skillCategorySharedCollection: ISkillCategory[] = [];
  statuses: ISkillCategory[] = [];
  skillNew = {};
  isSaving = false;

  constructor(
    protected fb: FormBuilder,
    protected skillService: SkillService,
    protected skillCategoryService: SkillCategoryService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {
    this.skills = [];
  }

  // --------------------------------------------------------------------EDIT TABLE METODOS
  onRowEditInit(skill: ISkill): void {
    if (this.activatedRoute.snapshot.params.id) {
      skill.skillCategory = this.skillCategory;
    }
  }

  onRowEditSave(skill: ISkill): void {
    this.save(skill);
  }

  onRowEditCancel(skill: ISkill): void {
    if (!skill.id) {
      skill.id = undefined;
      skill.name = undefined;
      skill.skillCategory = undefined;
    } else {
      this.loadPage(1, true);
    }
  }

  onRowDelete(skill: ISkill): void {
    const modalRef = this.modalService.open(SkillDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.skill = skill;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage(1, true);
      }
    });
  }

  save(skill: ISkill): void {
    if (skill.id !== undefined) {
      this.subscribeToSaveResponse(this.skillService.update(skill));
    } else {
      this.skillService.create(skill).subscribe(() => this.loadPage(1,true));
    }
    this.skillNew = {};
  }
  // --------------------------------------------------------------------------------- FIN ORIGINAL

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    const filters: Map<string, any> = new Map();

    if (this.activatedRoute.snapshot.params.id) {
      filters.set('skillCategoryId.equals', this.skillCategory!.id);
    }

    this.skillService
      .query({
        filter: filters,
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ISkill[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ skillCategory }) => {
      this.skillCategory = skillCategory;
      this.handleNavigation();
      this.loadRelationshipsOptions();
    });
  }

  trackId(index: number, item: ISkill): number {
    return item.id!;
  }

  trackSkillCategoryById(index: number, item: ISkillCategory): number {
    return item.id!;
  }


  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: ISkill[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/skill'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    if (data) {
      this.skills = [];
      this.skills.push(this.skillNew);
      for (const d of data) {
        this.skills.push(d);
      }
    this.ngbPaginationPage = this.page;

    }
    // this.skills = data ?? [];
    // this.skills.push(this.skillNew);
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISkill>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(() => this.onSaveError());
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
