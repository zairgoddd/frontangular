import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaqueFormComponent } from './ataque-form.component';

describe('AtaqueFormComponent', () => {
  let component: AtaqueFormComponent;
  let fixture: ComponentFixture<AtaqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtaqueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
