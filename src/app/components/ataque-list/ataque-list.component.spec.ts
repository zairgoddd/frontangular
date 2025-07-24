import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtaqueListComponent } from './ataque-list.component';

describe('AtaqueListComponent', () => {
  let component: AtaqueListComponent;
  let fixture: ComponentFixture<AtaqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtaqueListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtaqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
