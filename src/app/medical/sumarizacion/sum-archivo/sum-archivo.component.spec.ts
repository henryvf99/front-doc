import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumArchivoComponent } from './sum-archivo.component';

describe('SumArchivoComponent', () => {
  let component: SumArchivoComponent;
  let fixture: ComponentFixture<SumArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SumArchivoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SumArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
