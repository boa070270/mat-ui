import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonFieldConfig, EnumInputType, EnumKindOfField} from './form-configuration';
import {AbstractControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldsComponent implements OnInit, OnChanges {
  hide = true;
  enumKindOfField = EnumKindOfField;
  enumInputType = EnumInputType;
  @Input() formGroup: FormGroup;
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
    if ( !this.formGroup) {
      throw new TypeError('formConfiguration is required');
    }
    if (!this.formConfiguration) {
      throw new TypeError('formConfiguration is required');
    }
  }
  formControlByName(controlName: string): AbstractControl {
    return this.formGroup.get(controlName);
  }
}
