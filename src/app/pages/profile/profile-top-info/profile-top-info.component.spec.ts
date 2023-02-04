import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTopInfoComponent } from './profile-top-info.component';

describe('ProfileTopInfoComponent', () => {
  let component: ProfileTopInfoComponent;
  let fixture: ComponentFixture<ProfileTopInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTopInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTopInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
