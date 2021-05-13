jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PersonSkillService } from '../service/person-skill.service';

import { PersonSkillDeleteDialogComponent } from './person-skill-delete-dialog.component';

describe('Component Tests', () => {
  describe('PersonSkill Management Delete Component', () => {
    let comp: PersonSkillDeleteDialogComponent;
    let fixture: ComponentFixture<PersonSkillDeleteDialogComponent>;
    let service: PersonSkillService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PersonSkillDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(PersonSkillDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PersonSkillDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PersonSkillService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
