import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideOldFilterComponent } from './hide-old-filter.component';

describe('HideOldFilterComponent', () => {
  let component: HideOldFilterComponent;
  let fixture: ComponentFixture<HideOldFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HideOldFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HideOldFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
