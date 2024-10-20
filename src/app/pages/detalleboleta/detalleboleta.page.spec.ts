import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleboletaPage } from './detalleboleta.page';

describe('DetalleboletaPage', () => {
  let component: DetalleboletaPage;
  let fixture: ComponentFixture<DetalleboletaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleboletaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
