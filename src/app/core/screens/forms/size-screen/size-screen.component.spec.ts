import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeScreenComponent } from './size-screen.component';

describe('SizeScreenComponent', () => {
  let component: SizeScreenComponent;
  let fixture: ComponentFixture<SizeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SizeScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
