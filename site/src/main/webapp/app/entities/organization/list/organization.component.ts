import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrimeNGConfig } from 'primeng/api';

import { IOrganization } from '../organization.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { OrganizationService } from '../service/organization.service';
import { OrganizationDeleteDialogComponent } from '../delete/organization-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { OrganizationFilter } from './organization.filter';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'jhi-organization',
  templateUrl: './organization.component.html',
})
export class OrganizationComponent implements OnInit {
  organizations: IOrganization[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  filters: OrganizationFilter = new OrganizationFilter();
  filterForm = this.fb.group({
    filterName: [],
  });

  constructor(
    protected fb: FormBuilder,
    protected organizationService: OrganizationService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    private primengConfig: PrimeNGConfig
  ) {
    this.organizations = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'name';
    this.ascending = true;
  }

  filter(): void {
    this.createFilterForm();
    this.reset();
  }

  cleanFilter(): void {
    this.filters.name = '';
    this.filterForm.reset();
    this.reset();
  }

  loadAll(): void {
    this.isLoading = true;

    this.organizationService
      .query({
        filter: this.filters.toMap(),
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IOrganization[]>) => {
          this.isLoading = false;
          this.paginateOrganizations(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.organizations = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.primengConfig.ripple = true;
  }

  trackId(index: number, item: IOrganization): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(organization: IOrganization): void {
    const modalRef = this.modalService.open(OrganizationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.organization = organization;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  createFilterForm(): void {
    this.filters.name = this.filterForm.get(['filterName'])!.value;
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateOrganizations(data: IOrganization[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.organizations.push(d);
      }
    }
  }
}