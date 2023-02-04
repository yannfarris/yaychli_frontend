import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryFiltersComponent } from './query-filters.component';

describe('QueryFiltersComponent', () => {
  let component: QueryFiltersComponent;
  let fixture: ComponentFixture<QueryFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
