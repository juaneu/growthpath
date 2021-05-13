jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPersonSkill, PersonSkill } from '../person-skill.model';
import { PersonSkillService } from '../service/person-skill.service';

import { PersonSkillRoutingResolveService } from './person-skill-routing-resolve.service';

describe('Service Tests', () => {
  describe('PersonSkill routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PersonSkillRoutingResolveService;
    let service: PersonSkillService;
    let resultPersonSkill: IPersonSkill | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PersonSkillRoutingResolveService);
      service = TestBed.inject(PersonSkillService);
      resultPersonSkill = undefined;
    });

    describe('resolve', () => {
      it('should return IPersonSkill returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPersonSkill = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPersonSkill).toEqual({ id: 123 });
      });

      it('should return new IPersonSkill if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPersonSkill = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPersonSkill).toEqual(new PersonSkill());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPersonSkill = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPersonSkill).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
