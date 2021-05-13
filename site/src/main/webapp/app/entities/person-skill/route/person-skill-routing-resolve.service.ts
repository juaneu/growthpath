import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPersonSkill, PersonSkill } from '../person-skill.model';
import { PersonSkillService } from '../service/person-skill.service';

@Injectable({ providedIn: 'root' })
export class PersonSkillRoutingResolveService implements Resolve<IPersonSkill> {
  constructor(protected service: PersonSkillService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPersonSkill> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((personSkill: HttpResponse<PersonSkill>) => {
          if (personSkill.body) {
            return of(personSkill.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PersonSkill());
  }
}
