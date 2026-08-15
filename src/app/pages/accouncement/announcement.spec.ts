import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accouncement } from './accouncement';

describe('Accouncement', () => {
  let component: Accouncement;
  let fixture: ComponentFixture<Accouncement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accouncement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accouncement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
