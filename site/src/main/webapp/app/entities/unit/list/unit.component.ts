import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUnit } from '../unit.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { UnitService } from '../service/unit.service';
import { UnitDeleteDialogComponent } from '../delete/unit-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { UnitFilter } from './unit.filter';
import { FormBuilder } from '@angular/forms';
import { IOrganization } from 'app/entities/organization/organization.model';
import { ActivatedRoute } from '@angular/router';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'jhi-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent implements OnInit {
  units: IUnit[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  filters: UnitFilter = new UnitFilter();
  filterForm = this.fb.group({
    filterName: [],
  });
  organization?: IOrganization;

  cols?: any[];
  exportColumns?: any[];

  constructor(
    protected fb: FormBuilder,
    protected unitService: UnitService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.units = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'name';
    this.ascending = true;
  }

  filter(): void {
    this.createFilterFromForm();
    this.reset();
  }

  resetFormulario(): void {
    this.filterForm = this.fb.group({
      filterName: [],
    });
    this.filters.name = '';
    this.reset();
  }

  loadAll(): void {
    this.isLoading = true;

    if (this.activatedRoute.snapshot.params.id) {
      this.addEntityFilter();
    }

    this.unitService
      .query({
        filter: this.filters.toMap(),
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IUnit[]>) => {
          this.isLoading = false;
          this.paginateUnits(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.units = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organization }) => {
      this.organization = organization;
      this.loadAll();
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
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default();
        (doc as any).autoTable(this.exportColumns, this.units);
        doc.save('units.pdf');
      });
    });
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.units);
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
        this.reset();
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

  protected paginateUnits(data: IUnit[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.units.push(d);
      }
    }
  }
}
