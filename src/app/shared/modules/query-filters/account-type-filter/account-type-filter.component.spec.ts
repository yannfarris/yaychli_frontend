import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTypeFilterComponent } from './account-type-filter.component';

describe('AccountTypeFilterComponent', () => {
  let component: AccountTypeFilterComponent;
  let fixture: ComponentFixture<AccountTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
