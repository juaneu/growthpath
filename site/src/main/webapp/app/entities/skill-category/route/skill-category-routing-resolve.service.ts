import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISkillCategory, SkillCategory } from '../skill-category.model';
import { SkillCategoryService } from '../service/skill-category.service';

@Injectable({ providedIn: 'root' })
export class SkillCategoryRoutingResolveService implements Resolve<ISkillCategory> {
  constructor(protected service: SkillCategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISkillCategory> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((skillCategory: HttpResponse<SkillCategory>) => {
          if (skillCategory.body) {
            return of(skillCategory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SkillCategory());
  }
}
