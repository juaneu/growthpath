import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISkillCategory, getSkillCategoryIdentifier } from '../skill-category.model';

export type EntityResponseType = HttpResponse<ISkillCategory>;
export type EntityArrayResponseType = HttpResponse<ISkillCategory[]>;

@Injectable({ providedIn: 'root' })
export class SkillCategoryService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/skill-categories');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(skillCategory: ISkillCategory): Observable<EntityResponseType> {
    return this.http.post<ISkillCategory>(this.resourceUrl, skillCategory, { observe: 'response' });
  }

  update(skillCategory: ISkillCategory): Observable<EntityResponseType> {
    return this.http.put<ISkillCategory>(`${this.resourceUrl}/${getSkillCategoryIdentifier(skillCategory) as number}`, skillCategory, {
      observe: 'response',
    });
  }

  partialUpdate(skillCategory: ISkillCategory): Observable<EntityResponseType> {
    return this.http.patch<ISkillCategory>(`${this.resourceUrl}/${getSkillCategoryIdentifier(skillCategory) as number}`, skillCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISkillCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISkillCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSkillCategoryToCollectionIfMissing(
    skillCategoryCollection: ISkillCategory[],
    ...skillCategoriesToCheck: (ISkillCategory | null | undefined)[]
  ): ISkillCategory[] {
    const skillCategories: ISkillCategory[] = skillCategoriesToCheck.filter(isPresent);
    if (skillCategories.length > 0) {
      const skillCategoryCollectionIdentifiers = skillCategoryCollection.map(
        skillCategoryItem => getSkillCategoryIdentifier(skillCategoryItem)!
      );
      const skillCategoriesToAdd = skillCategories.filter(skillCategoryItem => {
        const skillCategoryIdentifier = getSkillCategoryIdentifier(skillCategoryItem);
        if (skillCategoryIdentifier == null || skillCategoryCollectionIdentifiers.includes(skillCategoryIdentifier)) {
          return false;
        }
        skillCategoryCollectionIdentifiers.push(skillCategoryIdentifier);
        return true;
      });
      return [...skillCategoriesToAdd, ...skillCategoryCollection];
    }
    return skillCategoryCollection;
  }
}
