import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonedaPage } from './moneda.page';

describe('MonedaPage', () => {
  let component: MonedaPage;
  let fixture: ComponentFixture<MonedaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonedaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
