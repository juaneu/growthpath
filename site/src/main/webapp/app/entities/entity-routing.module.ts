import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'organization',
        data: { pageTitle: 'growthpathApp.organization.home.title' },
        loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
      },
      {
        path: 'person',
        data: { pageTitle: 'growthpathApp.person.home.title' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'unit',
        data: { pageTitle: 'growthpathApp.unit.home.title' },
        loadChildren: () => import('./unit/unit.module').then(m => m.UnitModule),
      },
      {
        path: 'skill-category',
        data: { pageTitle: 'growthpathApp.skillCategory.home.title' },
        loadChildren: () => import('./skill-category/skill-category.module').then(m => m.SkillCategoryModule),
      },
      {
        path: 'skill',
        data: { pageTitle: 'growthpathApp.skill.home.title' },
        loadChildren: () => import('./skill/skill.module').then(m => m.SkillModule),
      },
      {
        path: 'person-skill',
        data: { pageTitle: 'growthpathApp.personSkill.home.title' },
        loadChildren: () => import('./person-skill/person-skill.module').then(m => m.PersonSkillModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
