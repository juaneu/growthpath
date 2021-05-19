import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDocument } from '../document.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DocumentService } from '../service/document.service';
import { DocumentDeleteDialogComponent } from '../delete/document-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { ActivatedRoute } from '@angular/router';
import { IPerson } from 'app/entities/person/person.model';

@Component({
  selector: 'jhi-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnInit {
  documents: IDocument[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  person?: IPerson;

  constructor(
    protected documentService: DocumentService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.documents = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'person.name';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    const filters: Map<string, any> = new Map();

    if (this.activatedRoute.snapshot.params.id) {
      filters.set('personId.equals', this.person!.id);
    }

    this.documentService
      .query({
        filter: filters,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IDocument[]>) => {
          this.isLoading = false;
          this.paginateDocuments(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.documents = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ person }) => {
      this.person = person;
      this.loadAll();
    });
  }

  trackId(index: number, item: IDocument): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(document: IDocument): void {
    const modalRef = this.modalService.open(DocumentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.document = document;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateDocuments(data: IDocument[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.documents.push(d);
      }
    }
  }
}
