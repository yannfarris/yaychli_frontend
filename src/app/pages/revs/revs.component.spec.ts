import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevsComponent } from './revs.component';

describe('RevsComponent', () => {
  let component: RevsComponent;
  let fixture: ComponentFixture<RevsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
