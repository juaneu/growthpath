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

import * as FileSaver from 'file-saver';

@Component({
  selector: 'jhi-unit',
  templateUrl: './unit.component.html',
  styleUrls : ['./unit.component.css']
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
  isCollapseFilter = false;

  cols?: any[];
  exportColumns?: any[];

  constructor(
    protected fb: FormBuilder,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  collapseFilter(): void {
    this.isCollapseFilter = !(this.isCollapseFilter);
}
  /* eslint-disable no-console */

  filter(): void {
    this.createFilterFromForm();
    // this.handleNavigation();
    this.loadPage(1, true);
  }

  resetFormulario(): void {
    this.filterForm = this.fb.group({
      filterName: [],
    });
    this.filters.name = '';
    this.loadPage(1, true);
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    if (this.activatedRoute.snapshot.params.id) {
      this.addEntityFilter();
    }
    console.log(this.filters.toMap());

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

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  exportPdf(): void {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default();
        (doc as any).autoTable(this.exportColumns, this.units);
        doc.save('units.pdf');
      });
    });
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.units!);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'units');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
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
  /* eslint-disable no-console */
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
