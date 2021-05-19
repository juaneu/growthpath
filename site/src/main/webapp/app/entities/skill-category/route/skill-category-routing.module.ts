import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SkillCategoryComponent } from '../list/skill-category.component';
import { SkillCategoryDetailComponent } from '../detail/skill-category-detail.component';
import { SkillCategoryUpdateComponent } from '../update/skill-category-update.component';
import { SkillCategoryRoutingResolveService } from './skill-category-routing-resolve.service';
import { SkillComponent } from '../../skill/list/skill.component';

const skillCategoryRoute: Routes = [
  {
    path: '',
    component: SkillCategoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SkillCategoryDetailComponent,
    resolve: {
      skillCategory: SkillCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SkillCategoryUpdateComponent,
    resolve: {
      skillCategory: SkillCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SkillCategoryUpdateComponent,
    resolve: {
      skillCategory: SkillCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/skill',
    component: SkillComponent,
    resolve: {
      skillCategory: SkillCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(skillCategoryRoute)],
  exports: [RouterModule],
})
export class SkillCategoryRoutingModule {}
