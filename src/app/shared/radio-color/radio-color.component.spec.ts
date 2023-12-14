import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioColorComponent } from './radio-color.component';

describe('RadioColorComponent', () => {
  let component: RadioColorComponent;
  let fixture: ComponentFixture<RadioColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioColorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
