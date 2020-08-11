import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonFieldConfig, EnumInputType, EnumKindOfField, FormControlCollections, FormGroupOrControl} from './form-configuration';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css']
})
export class FormFieldsComponent implements OnInit, OnChanges {
  hide = true;
  enumKindOfField = EnumKindOfField;
  enumInputType = EnumInputType;
  @Input() formControlCollections: FormControlCollections;
  @Input() formConfiguration: Array<CommonFieldConfig>;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkRequired();
  }

  ngOnInit(): void {
    this.checkRequired();
  }
  checkRequired(): void {
    if (!this.formControlCollections) {
      throw new TypeError('formControlCollections is required');
    }
    if (!this.formConfiguration) {
      throw new TypeError('formConfiguration is required');
    }
  }
  formControlByName(controlName: string): FormControl | FormGroup {
    if (this.formControlCollections && this.formControlCollections[controlName]) {
      return this.formControlCollections[controlName].control;
    }
  }
  childControlCollectionByName(controlName: string): FormControlCollections {
    if (this.formControlCollections && this.formControlCollections[controlName]) {
      return this.formControlCollections[controlName].children;
    }
  }
}
