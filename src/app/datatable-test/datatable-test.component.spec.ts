import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableTestComponent } from './datatable-test.component';

describe('DatatableTestComponent', () => {
  let component: DatatableTestComponent;
  let fixture: ComponentFixture<DatatableTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatableTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
