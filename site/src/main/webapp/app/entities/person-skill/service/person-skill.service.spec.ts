import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SkillLevel } from 'app/entities/enumerations/skill-level.model';
import { IPersonSkill, PersonSkill } from '../person-skill.model';

import { PersonSkillService } from './person-skill.service';

describe('Service Tests', () => {
  describe('PersonSkill Service', () => {
    let service: PersonSkillService;
    let httpMock: HttpTestingController;
    let elemDefault: IPersonSkill;
    let expectedResult: IPersonSkill | IPersonSkill[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PersonSkillService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        comments: 'AAAAAAA',
        level: SkillLevel.HIGHER,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PersonSkill', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new PersonSkill()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PersonSkill', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            comments: 'BBBBBB',
            level: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a PersonSkill', () => {
        const patchObject = Object.assign({}, new PersonSkill());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PersonSkill', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            comments: 'BBBBBB',
            level: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PersonSkill', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPersonSkillToCollectionIfMissing', () => {
        it('should add a PersonSkill to an empty array', () => {
          const personSkill: IPersonSkill = { id: 123 };
          expectedResult = service.addPersonSkillToCollectionIfMissing([], personSkill);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(personSkill);
        });

        it('should not add a PersonSkill to an array that contains it', () => {
          const personSkill: IPersonSkill = { id: 123 };
          const personSkillCollection: IPersonSkill[] = [
            {
              ...personSkill,
            },
            { id: 456 },
          ];
          expectedResult = service.addPersonSkillToCollectionIfMissing(personSkillCollection, personSkill);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PersonSkill to an array that doesn't contain it", () => {
          const personSkill: IPersonSkill = { id: 123 };
          const personSkillCollection: IPersonSkill[] = [{ id: 456 }];
          expectedResult = service.addPersonSkillToCollectionIfMissing(personSkillCollection, personSkill);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(personSkill);
        });

        it('should add only unique PersonSkill to an array', () => {
          const personSkillArray: IPersonSkill[] = [{ id: 123 }, { id: 456 }, { id: 11044 }];
          const personSkillCollection: IPersonSkill[] = [{ id: 123 }];
          expectedResult = service.addPersonSkillToCollectionIfMissing(personSkillCollection, ...personSkillArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const personSkill: IPersonSkill = { id: 123 };
          const personSkill2: IPersonSkill = { id: 456 };
          expectedResult = service.addPersonSkillToCollectionIfMissing([], personSkill, personSkill2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(personSkill);
          expect(expectedResult).toContain(personSkill2);
        });

        it('should accept null and undefined values', () => {
          const personSkill: IPersonSkill = { id: 123 };
          expectedResult = service.addPersonSkillToCollectionIfMissing([], null, personSkill, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(personSkill);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
