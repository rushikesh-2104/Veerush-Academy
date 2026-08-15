import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarAssistant } from './avatar-assistant';

describe('AvatarAssistant', () => {
  let component: AvatarAssistant;
  let fixture: ComponentFixture<AvatarAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
