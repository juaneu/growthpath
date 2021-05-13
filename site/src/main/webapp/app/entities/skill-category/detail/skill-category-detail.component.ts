import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISkillCategory } from '../skill-category.model';

@Component({
  selector: 'jhi-skill-category-detail',
  templateUrl: './skill-category-detail.component.html',
})
export class SkillCategoryDetailComponent implements OnInit {
  skillCategory: ISkillCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ skillCategory }) => {
      this.skillCategory = skillCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
