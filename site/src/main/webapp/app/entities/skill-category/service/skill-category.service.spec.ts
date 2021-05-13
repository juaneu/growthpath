import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISkillCategory, SkillCategory } from '../skill-category.model';

import { SkillCategoryService } from './skill-category.service';

describe('Service Tests', () => {
  describe('SkillCategory Service', () => {
    let service: SkillCategoryService;
    let httpMock: HttpTestingController;
    let elemDefault: ISkillCategory;
    let expectedResult: ISkillCategory | ISkillCategory[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SkillCategoryService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a SkillCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SkillCategory()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SkillCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SkillCategory', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new SkillCategory()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SkillCategory', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a SkillCategory', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSkillCategoryToCollectionIfMissing', () => {
        it('should add a SkillCategory to an empty array', () => {
          const skillCategory: ISkillCategory = { id: 123 };
          expectedResult = service.addSkillCategoryToCollectionIfMissing([], skillCategory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(skillCategory);
        });

        it('should not add a SkillCategory to an array that contains it', () => {
          const skillCategory: ISkillCategory = { id: 123 };
          const skillCategoryCollection: ISkillCategory[] = [
            {
              ...skillCategory,
            },
            { id: 456 },
          ];
          expectedResult = service.addSkillCategoryToCollectionIfMissing(skillCategoryCollection, skillCategory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SkillCategory to an array that doesn't contain it", () => {
          const skillCategory: ISkillCategory = { id: 123 };
          const skillCategoryCollection: ISkillCategory[] = [{ id: 456 }];
          expectedResult = service.addSkillCategoryToCollectionIfMissing(skillCategoryCollection, skillCategory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(skillCategory);
        });

        it('should add only unique SkillCategory to an array', () => {
          const skillCategoryArray: ISkillCategory[] = [{ id: 123 }, { id: 456 }, { id: 48714 }];
          const skillCategoryCollection: ISkillCategory[] = [{ id: 123 }];
          expectedResult = service.addSkillCategoryToCollectionIfMissing(skillCategoryCollection, ...skillCategoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const skillCategory: ISkillCategory = { id: 123 };
          const skillCategory2: ISkillCategory = { id: 456 };
          expectedResult = service.addSkillCategoryToCollectionIfMissing([], skillCategory, skillCategory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(skillCategory);
          expect(expectedResult).toContain(skillCategory2);
        });

        it('should accept null and undefined values', () => {
          const skillCategory: ISkillCategory = { id: 123 };
          expectedResult = service.addSkillCategoryToCollectionIfMissing([], null, skillCategory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(skillCategory);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
