import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUnit } from '../unit.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { UnitService } from '../service/unit.service';
import { UnitDeleteDialogComponent } from '../delete/unit-delete-dialog.component';
import { UnitFilter } from './unit.filter';
import { FormBuilder } from '@angular/forms';
import { IOrganization } from 'app/entities/organization/organization.model';

@Component({
  selector: 'jhi-unit',
  templateUrl: './unit.component.html',
})
export class UnitComponent implements OnInit {
  units?: IUnit[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  filters: UnitFilter = new UnitFilter();
  filterForm = this.fb.group({
    filterName: [],
  });
  organization?: IOrganization;

  constructor(
    protected fb: FormBuilder,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  filter(): void {
    this.createFilterFromForm();
    this.loadPage();
  }

  resetFormulario(): void {
    this.filterForm = this.fb.group({
      filterName: [],
    });
    this.filters.name = '';
    this.loadPage();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if (this.activatedRoute.snapshot.params.id) {
      this.addEntityFilter();
    }

    this.unitService
      .query({
        filter: this.filters.toMap(),
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IUnit[]>) => {
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
    this.activatedRoute.data.subscribe(({ organization }) => {
      this.organization = organization;
      this.handleNavigation();
    });
  }

  trackId(index: number, item: IUnit): number {
    return item.id!;
  }

  delete(unit: IUnit): void {
    const modalRef = this.modalService.open(UnitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.unit = unit;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  createFilterFromForm(): void {
    this.filters.name = this.filterForm.get(['filterName'])!.value;
  }

  addEntityFilter(): void {
    this.filters.organizationId = this.organization!.id;
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

  protected onSuccess(data: IUnit[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/unit'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.units = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
