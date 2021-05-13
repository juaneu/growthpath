import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISkillCategory } from '../skill-category.model';
import { SkillCategoryService } from '../service/skill-category.service';

@Component({
  templateUrl: './skill-category-delete-dialog.component.html',
})
export class SkillCategoryDeleteDialogComponent {
  skillCategory?: ISkillCategory;

  constructor(protected skillCategoryService: SkillCategoryService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.skillCategoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
