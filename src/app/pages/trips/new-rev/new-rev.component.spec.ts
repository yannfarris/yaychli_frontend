import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRevComponent } from './new-rev.component';

describe('NewRevComponent', () => {
  let component: NewRevComponent;
  let fixture: ComponentFixture<NewRevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
