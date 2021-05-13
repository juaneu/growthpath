import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SkillCategoryDetailComponent } from './skill-category-detail.component';

describe('Component Tests', () => {
  describe('SkillCategory Management Detail Component', () => {
    let comp: SkillCategoryDetailComponent;
    let fixture: ComponentFixture<SkillCategoryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SkillCategoryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ skillCategory: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SkillCategoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SkillCategoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load skillCategory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.skillCategory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
