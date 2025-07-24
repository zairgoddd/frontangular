import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenazaFormComponent } from './amenaza-form.component';

describe('AmenazaFormComponent', () => {
  let component: AmenazaFormComponent;
  let fixture: ComponentFixture<AmenazaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenazaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenazaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
