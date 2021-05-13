import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonSkill, getPersonSkillIdentifier } from '../person-skill.model';

export type EntityResponseType = HttpResponse<IPersonSkill>;
export type EntityArrayResponseType = HttpResponse<IPersonSkill[]>;

@Injectable({ providedIn: 'root' })
export class PersonSkillService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/person-skills');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(personSkill: IPersonSkill): Observable<EntityResponseType> {
    return this.http.post<IPersonSkill>(this.resourceUrl, personSkill, { observe: 'response' });
  }

  update(personSkill: IPersonSkill): Observable<EntityResponseType> {
    return this.http.put<IPersonSkill>(`${this.resourceUrl}/${getPersonSkillIdentifier(personSkill) as number}`, personSkill, {
      observe: 'response',
    });
  }

  partialUpdate(personSkill: IPersonSkill): Observable<EntityResponseType> {
    return this.http.patch<IPersonSkill>(`${this.resourceUrl}/${getPersonSkillIdentifier(personSkill) as number}`, personSkill, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPersonSkill>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPersonSkill[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPersonSkillToCollectionIfMissing(
    personSkillCollection: IPersonSkill[],
    ...personSkillsToCheck: (IPersonSkill | null | undefined)[]
  ): IPersonSkill[] {
    const personSkills: IPersonSkill[] = personSkillsToCheck.filter(isPresent);
    if (personSkills.length > 0) {
      const personSkillCollectionIdentifiers = personSkillCollection.map(personSkillItem => getPersonSkillIdentifier(personSkillItem)!);
      const personSkillsToAdd = personSkills.filter(personSkillItem => {
        const personSkillIdentifier = getPersonSkillIdentifier(personSkillItem);
        if (personSkillIdentifier == null || personSkillCollectionIdentifiers.includes(personSkillIdentifier)) {
          return false;
        }
        personSkillCollectionIdentifiers.push(personSkillIdentifier);
        return true;
      });
      return [...personSkillsToAdd, ...personSkillCollection];
    }
    return personSkillCollection;
  }
}
