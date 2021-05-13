import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPersonSkill } from '../person-skill.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-person-skill-detail',
  templateUrl: './person-skill-detail.component.html',
})
export class PersonSkillDetailComponent implements OnInit {
  personSkill: IPersonSkill | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personSkill }) => {
      this.personSkill = personSkill;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
