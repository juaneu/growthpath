import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISkillCategory } from '../skill-category.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SkillCategoryService } from '../service/skill-category.service';
import { SkillCategoryDeleteDialogComponent } from '../delete/skill-category-delete-dialog.component';
import { SkillCategoryFilter } from './skill-category.filter';
import { FormBuilder } from '@angular/forms';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'jhi-skill-category',
  templateUrl: './skill-category.component.html',
})
export class SkillCategoryComponent implements OnInit {
  skillCategories?: ISkillCategory[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  unitsSharedCollection: IUnit[] = [];
  filterForm = this.fb.group({
    filterName: [],
    filterUnit: [],
  });
  filters: SkillCategoryFilter = new SkillCategoryFilter();
  constructor(
    protected fb: FormBuilder,
    protected skillCategoryService: SkillCategoryService,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  filter(): void {
    this.createFilterFromForm();
    this.loadPage();
  }
  cleanFilter(): void {
    this.filters.name = '';
    this.filters.unit = undefined;
    this.filterForm.reset;
    this.loadPage();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.skillCategoryService
      .query({
        filter: this.filters.myMap(),
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ISkillCategory[]>) => {
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
    this.handleNavigation();
    this.loadRelationshipsOptions();
  }

  trackId(index: number, item: ISkillCategory): number {
    return item.id!;
  }
  trackUnitById(index: number, item: IUnit): number {
    return item.id!;
  }
  createFilterFromForm(): void {
    this.filters.name = this.filterForm.get(['filterName'])!.value;
    this.filters.unit = this.filterForm.get(['filterUnit'])!.value?.id;
  }
  delete(skillCategory: ISkillCategory): void {
    const modalRef = this.modalService.open(SkillCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.skillCategory = skillCategory;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }
  protected loadRelationshipsOptions(): void {
    this.unitService
      .query()
      .pipe(map((res: HttpResponse<IUnit[]>) => res.body ?? []))
      .pipe(map((units: IUnit[]) => this.unitService.addUnitToCollectionIfMissing(units, this.filterForm.get('filterUnit')!.value)))
      .subscribe((units: IUnit[]) => (this.unitsSharedCollection = units));
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

  protected onSuccess(data: ISkillCategory[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/skill-category'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.skillCategories = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
