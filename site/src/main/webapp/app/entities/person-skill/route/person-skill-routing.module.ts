import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PersonSkillComponent } from '../list/person-skill.component';
import { PersonSkillDetailComponent } from '../detail/person-skill-detail.component';
import { PersonSkillUpdateComponent } from '../update/person-skill-update.component';
import { PersonSkillRoutingResolveService } from './person-skill-routing-resolve.service';

const personSkillRoute: Routes = [
  {
    path: '',
    component: PersonSkillComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonSkillDetailComponent,
    resolve: {
      personSkill: PersonSkillRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonSkillUpdateComponent,
    resolve: {
      personSkill: PersonSkillRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonSkillUpdateComponent,
    resolve: {
      personSkill: PersonSkillRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(personSkillRoute)],
  exports: [RouterModule],
})
export class PersonSkillRoutingModule {}
