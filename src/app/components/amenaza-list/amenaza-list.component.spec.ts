import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenazaListComponent } from './amenaza-list.component';

describe('AmenazaListComponent', () => {
  let component: AmenazaListComponent;
  let fixture: ComponentFixture<AmenazaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmenazaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmenazaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
