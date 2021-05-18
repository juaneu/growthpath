import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISkillCategory } from '../skill-category.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SkillCategoryService } from '../service/skill-category.service';
import { SkillCategoryDeleteDialogComponent } from '../delete/skill-category-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-skill-category',
  templateUrl: './skill-category.component.html',
})
export class SkillCategoryComponent implements OnInit {
  skillCategories: ISkillCategory[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected skillCategoryService: SkillCategoryService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.skillCategories = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'name';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.skillCategoryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ISkillCategory[]>) => {
          this.isLoading = false;
          this.paginateSkillCategories(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.skillCategories = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISkillCategory): number {
    return item.id!;
  }

  delete(skillCategory: ISkillCategory): void {
    const modalRef = this.modalService.open(SkillCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.skillCategory = skillCategory;
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

  protected paginateSkillCategories(data: ISkillCategory[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.skillCategories.push(d);
      }
    }
  }
}
