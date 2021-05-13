import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPersonSkill } from '../person-skill.model';
import { PersonSkillService } from '../service/person-skill.service';

@Component({
  templateUrl: './person-skill-delete-dialog.component.html',
})
export class PersonSkillDeleteDialogComponent {
  personSkill?: IPersonSkill;

  constructor(protected personSkillService: PersonSkillService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personSkillService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
