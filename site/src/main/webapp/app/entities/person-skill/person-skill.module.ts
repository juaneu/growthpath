import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PersonSkillComponent } from './list/person-skill.component';
import { PersonSkillDetailComponent } from './detail/person-skill-detail.component';
import { PersonSkillUpdateComponent } from './update/person-skill-update.component';
import { PersonSkillDeleteDialogComponent } from './delete/person-skill-delete-dialog.component';
import { PersonSkillRoutingModule } from './route/person-skill-routing.module';

@NgModule({
  imports: [SharedModule, PersonSkillRoutingModule],
  declarations: [PersonSkillComponent, PersonSkillDetailComponent, PersonSkillUpdateComponent, PersonSkillDeleteDialogComponent],
  entryComponents: [PersonSkillDeleteDialogComponent],
})
export class PersonSkillModule {}
