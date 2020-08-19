import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldsTestComponent } from './form-fields-test.component';

describe('FormFieldsTestComponent', () => {
  let component: FormFieldsTestComponent;
  let fixture: ComponentFixture<FormFieldsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFieldsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
