import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerqrPage } from './scannerqr.page';

describe('ScannerqrPage', () => {
  let component: ScannerqrPage;
  let fixture: ComponentFixture<ScannerqrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerqrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
