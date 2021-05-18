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

  skillCategory?: ISkillCategory;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected skillService: SkillService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks
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
    });
  }

  trackId(index: number, item: ISkill): number {
    return item.id!;
  }

  delete(skill: ISkill): void {
    const modalRef = this.modalService.open(SkillDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.skill = skill;
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

  protected paginateSkills(data: ISkill[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.skills.push(d);
      }
    }
  }
}
