import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingBusComponent } from './moving-bus.component';

describe('MovingBusComponent', () => {
  let component: MovingBusComponent;
  let fixture: ComponentFixture<MovingBusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovingBusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingBusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
