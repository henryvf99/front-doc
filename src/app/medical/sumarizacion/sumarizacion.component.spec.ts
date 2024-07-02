import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumarizacionComponent } from './sumarizacion.component';

describe('SumarizacionComponent', () => {
  let component: SumarizacionComponent;
  let fixture: ComponentFixture<SumarizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SumarizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SumarizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
