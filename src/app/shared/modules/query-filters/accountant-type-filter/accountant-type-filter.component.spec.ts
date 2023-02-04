import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantTypeFilterComponent } from './accountant-type-filter.component';

describe('AccountantTypeFilterComponent', () => {
  let component: AccountantTypeFilterComponent;
  let fixture: ComponentFixture<AccountantTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountantTypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountantTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
