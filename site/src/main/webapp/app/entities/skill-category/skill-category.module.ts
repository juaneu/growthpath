import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SkillCategoryComponent } from './list/skill-category.component';
import { SkillCategoryDetailComponent } from './detail/skill-category-detail.component';
import { SkillCategoryUpdateComponent } from './update/skill-category-update.component';
import { SkillCategoryDeleteDialogComponent } from './delete/skill-category-delete-dialog.component';
import { SkillCategoryRoutingModule } from './route/skill-category-routing.module';

@NgModule({
  imports: [SharedModule, SkillCategoryRoutingModule],
  declarations: [SkillCategoryComponent, SkillCategoryDetailComponent, SkillCategoryUpdateComponent, SkillCategoryDeleteDialogComponent],
  entryComponents: [SkillCategoryDeleteDialogComponent],
})
export class SkillCategoryModule {}
