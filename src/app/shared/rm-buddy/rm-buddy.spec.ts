import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmBuddy } from './rm-buddy';

describe('RmBuddy', () => {
  let component: RmBuddy;
  let fixture: ComponentFixture<RmBuddy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmBuddy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RmBuddy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
